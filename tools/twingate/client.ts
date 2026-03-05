/**
 * Twingate GraphQL Client
 * Canonical implementation for all Twingate API operations
 *
 * Features:
 * - GraphQL request execution with error handling
 * - Connector lifecycle management (create, generate tokens, check status)
 * - Remote network queries and creation
 * - Resource management (create, assign access)
 * - Group queries and assignment
 * - Credential loading from environment
 */

import type {
  GraphQLResponse,
  RemoteNetwork,
  Connector,
  ConnectorTokens,
  Group,
  Resource,
  ProtocolInput,
  AccessInput,
  TwingateConfig,
} from './types.ts';

export class TwingateGraphQLClient {
  private networkName: string;
  private apiKey: string;
  private apiUrl: string;
  private responseCache: Map<string, { data: Record<string, unknown>; timestamp: number }> = new Map();
  private cacheMaxAge = 60000; // 60 seconds TTL

  constructor(config?: TwingateConfig) {
    this.networkName = config?.networkName || process.env.TWINGATE_NETWORK_NAME || '';
    this.apiKey = config?.apiKey || process.env.TWINGATE_API_KEY || '';

    if (!this.networkName || !this.apiKey) {
      throw new Error(
        'Missing Twingate credentials. Provide TWINGATE_NETWORK_NAME and TWINGATE_API_KEY in .env or constructor config'
      );
    }

    this.apiUrl = `https://${this.networkName}.twingate.com/api/graphql/`;
  }

  /**
   * Check if cached response is still valid
   * @param key - Cache key
   * @returns Cached data or null if expired/missing
   */
  private getCacheIfValid<T>(key: string): T | null {
    const cached = this.responseCache.get(key);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > this.cacheMaxAge) {
      this.responseCache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  /**
   * Store response in cache
   * @param key - Cache key
   * @param data - Data to cache
   */
  private setCache(key: string, data: Record<string, unknown>): void {
    this.responseCache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Invalidate cache for mutation operations
   * @param patterns - Cache key patterns to invalidate
   */
  private invalidateCache(patterns: string[]): void {
    for (const pattern of patterns) {
      for (const key of this.responseCache.keys()) {
        if (key.includes(pattern)) {
          this.responseCache.delete(key);
        }
      }
    }
  }

  /**
   * Execute a GraphQL request to the Twingate API
   * @param query - GraphQL query or mutation string
   * @param variables - Query variables object
   * @returns Parsed response data or throws on error
   */
  private async graphqlRequest<T = Record<string, unknown>>(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<T> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'X-API-KEY': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: variables || {} }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const result: GraphQLResponse<T> = await response.json();

    if (result.errors) {
      const errorMessages = result.errors.map((e) => e.message).join('; ');
      throw new Error(`GraphQL errors: ${errorMessages}`);
    }

    return result.data as T;
  }

  /**
   * Get all remote networks (cached for 60s)
   */
  async getRemoteNetworks(): Promise<RemoteNetwork[]> {
    const cacheKey = 'remoteNetworks:all';

    // Check cache first
    const cached = this.getCacheIfValid<RemoteNetwork[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const query = `
      query {
        remoteNetworks(first: 50) {
          edges {
            node {
              id
              name
              location
            }
          }
        }
      }
    `;

    const data = await this.graphqlRequest<{
      remoteNetworks: { edges: Array<{ node: RemoteNetwork }> };
    }>(query);

    const networks = data.remoteNetworks.edges.map((e) => e.node);
    this.setCache(cacheKey, networks);

    return networks;
  }

  /**
   * Find a remote network by name (case-insensitive)
   */
  async findRemoteNetwork(name: string): Promise<RemoteNetwork | null> {
    const networks = await this.getRemoteNetworks();
    return networks.find((n) => n.name.toLowerCase() === name.toLowerCase()) || null;
  }

  /**
   * Find a remote network by partial name match
   */
  async findRemoteNetworkByTerm(searchTerm: string): Promise<RemoteNetwork | null> {
    const networks = await this.getRemoteNetworks();
    return networks.find((n) => n.name.toLowerCase().includes(searchTerm.toLowerCase())) || null;
  }

  /**
   * Create a new remote network (invalidates remote networks cache)
   */
  async createRemoteNetwork(name: string): Promise<RemoteNetwork> {
    const mutation = `
      mutation CreateRemoteNetwork($name: String!) {
        remoteNetworkCreate(name: $name) {
          entity {
            id
            name
          }
        }
      }
    `;

    const data = await this.graphqlRequest<{
      remoteNetworkCreate: { entity: RemoteNetwork };
    }>(mutation, { name });

    // Invalidate remote networks cache
    this.invalidateCache(['remoteNetworks']);

    return data.remoteNetworkCreate.entity;
  }

  /**
   * Get or create a remote network by name
   */
  async getOrCreateRemoteNetwork(name: string): Promise<RemoteNetwork> {
    const existing = await this.findRemoteNetwork(name);
    if (existing) {
      return existing;
    }
    return this.createRemoteNetwork(name);
  }

  /**
   * Get all connectors
   */
  async getConnectors(): Promise<Connector[]> {
    const query = `
      query {
        connectors(first: 50) {
          edges {
            node {
              id
              name
              state
              hasStatusNotificationsEnabled
              remoteNetwork {
                id
                name
              }
            }
          }
        }
      }
    `;

    const data = await this.graphqlRequest<{
      connectors: { edges: Array<{ node: Connector }> };
    }>(query);

    return data.connectors.edges.map((e) => e.node);
  }

  /**
   * Find a connector by name (case-insensitive)
   */
  async findConnector(name: string): Promise<Connector | null> {
    const connectors = await this.getConnectors();
    return connectors.find((c) => c.name.toLowerCase() === name.toLowerCase()) || null;
  }

  /**
   * Find a connector by partial name match
   */
  async findConnectorByTerm(searchTerm: string): Promise<Connector | null> {
    const connectors = await this.getConnectors();
    return connectors.find((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase())) || null;
  }

  /**
   * Create a new connector in a remote network
   */
  async createConnector(
    remoteNetworkId: string,
    name: string,
    enableStatusNotifications: boolean = true
  ): Promise<Connector> {
    const mutation = `
      mutation CreateConnector($remoteNetworkId: ID!, $name: String!) {
        connectorCreate(
          remoteNetworkId: $remoteNetworkId
          name: $name
          hasStatusNotificationsEnabled: ${enableStatusNotifications}
        ) {
          entity {
            id
            name
            hasStatusNotificationsEnabled
          }
        }
      }
    `;

    const data = await this.graphqlRequest<{
      connectorCreate: { entity: Connector };
    }>(mutation, { remoteNetworkId, name });

    return data.connectorCreate.entity;
  }

  /**
   * Generate tokens for a connector
   */
  async generateConnectorTokens(connectorId: string): Promise<ConnectorTokens> {
    const mutation = `
      mutation GenerateConnectorTokens($connectorId: ID!) {
        connectorGenerateTokens(connectorId: $connectorId) {
          connectorTokens {
            accessToken
            refreshToken
          }
        }
      }
    `;

    const data = await this.graphqlRequest<{
      connectorGenerateTokens: { connectorTokens: ConnectorTokens };
    }>(mutation, { connectorId });

    return data.connectorGenerateTokens.connectorTokens;
  }

  /**
   * Get all groups (cached for 60s)
   */
  async getGroups(): Promise<Group[]> {
    const cacheKey = 'groups:all';

    // Check cache first
    const cached = this.getCacheIfValid<Group[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const query = `
      query {
        groups(first: 50) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `;

    const data = await this.graphqlRequest<{
      groups: { edges: Array<{ node: Group }> };
    }>(query);

    const groups = data.groups.edges.map((e) => e.node);
    this.setCache(cacheKey, groups);

    return groups;
  }

  /**
   * Find a group by name (case-insensitive)
   */
  async findGroup(name: string): Promise<Group | null> {
    const groups = await this.getGroups();
    return groups.find((g) => g.name.toLowerCase() === name.toLowerCase()) || null;
  }

  /**
   * Get the "Everyone" group
   */
  async getEveryoneGroup(): Promise<Group> {
    const everyone = await this.findGroup('Everyone');
    if (!everyone) {
      throw new Error('Everyone group not found in Twingate network');
    }
    return everyone;
  }

  /**
   * Create a new resource (invalidates resource cache)
   */
  async createResource(
    name: string,
    address: string,
    remoteNetworkId: string,
    options?: {
      alias?: string;
      protocols?: ProtocolInput;
    }
  ): Promise<Resource> {
    const mutation = `
      mutation CreateResource(
        $name: String!
        $address: String!
        $alias: String
        $remoteNetworkId: ID!
        $protocols: ProtocolsInput!
      ) {
        resourceCreate(
          name: $name
          address: $address
          alias: $alias
          remoteNetworkId: $remoteNetworkId
          protocols: $protocols
        ) {
          entity {
            id
            name
            alias
            address {
              value
            }
          }
        }
      }
    `;

    const defaultProtocols: ProtocolInput = {
      allowIcmp: false,
      tcp: { policy: 'RESTRICTED', ports: [] },
      udp: { policy: 'RESTRICTED', ports: [] },
    };

    const variables = {
      name,
      address,
      alias: options?.alias || null,
      remoteNetworkId,
      protocols: options?.protocols || defaultProtocols,
    };

    const data = await this.graphqlRequest<{
      resourceCreate: { entity: Resource };
    }>(mutation, variables);

    // No need to invalidate read caches - resources aren't cached yet
    // Future optimization: add resource cache and invalidate here

    return data.resourceCreate.entity;
  }

  /**
   * Assign access to a resource for one or more principals (groups/users, invalidates cache)
   */
  async assignResourceAccess(resourceId: string, principalIds: string[]): Promise<void> {
    const mutation = `
      mutation AddAccessToResource($resourceId: ID!, $access: [AccessInput!]!) {
        resourceAccessAdd(resourceId: $resourceId, access: $access) {
          entity {
            id
          }
        }
      }
    `;

    const variables = {
      resourceId,
      access: principalIds.map((principalId) => ({ principalId })),
    };

    await this.graphqlRequest(mutation, variables);

    // Invalidate groups cache
    this.invalidateCache(['groups']);
  }

  /**
   * Assign Everyone group to a resource
   */
  async assignEveryoneGroupToResource(resourceId: string): Promise<void> {
    const everyone = await this.getEveryoneGroup();
    await this.assignResourceAccess(resourceId, [everyone.id]);
  }

  /**
   * Get the current network name
   */
  getNetworkName(): string {
    return this.networkName;
  }
}

export default TwingateGraphQLClient;
