---
name: twingate
type: api-client
classification: public
description: Twingate Admin API GraphQL client for zero-trust network access - connector management, resource creation, access control
version: 1.0.0
last_updated: 2026-02-14
env_required: true
env_keys:
  - TWINGATE_NETWORK_NAME
  - TWINGATE_API_KEY
commands:
  - bun -e 'import {TwingateGraphQLClient} from "./tools/api/twingate/client.ts"; const c = new TwingateGraphQLClient(); ...'
related_tools:
  - tools/notmint
  - tools/monitor
---

# Twingate GraphQL Client

**Type:** API Client
**Classification:** 🌍 PUBLIC
**Status:** ✅ Production Ready

---

## Classification

**PUBLIC** - Twingate Admin API client for zero-trust network access management.

**Why Public:**
- Official Twingate GraphQL API (documented at twingate.com/docs)
- Standard API wrapper with no proprietary logic
- Widely useful for zero-trust network deployments
- No sensitive data in implementation (credentials in .env only)

---

## Purpose

TypeScript GraphQL client for the Twingate Admin API. Provides programmatic access to Twingate's zero-trust network platform for managing connectors, remote networks, resources, and access policies.

**Core Capabilities:**
- **Connector management**: Create connectors, generate deployment tokens, check status
- **Remote network operations**: Query, create, and manage remote networks
- **Resource management**: Register applications, set protocols/ports, manage DNS aliases
- **Access control**: Group assignment, permission management
- **Response caching**: 60-second TTL for query optimization
- **Type safety**: Full TypeScript definitions

**Use Cases:**
- **Infrastructure deployment**: Automated Twingate connector provisioning
- **Resource registration**: Programmatically expose internal services
- **Access management**: Assign groups to resources
- **Network automation**: Self-service zero-trust network setup
- **Integration workflows**: Twingate in CI/CD pipelines

---

## Usage

### Basic Setup

```typescript
import { TwingateGraphQLClient } from '@/tools/twingate/client.ts';

// Initialize with environment variables
const client = new TwingateGraphQLClient();

// Or provide config directly
const client = new TwingateGraphQLClient({
  networkName: 'my-network',
  apiKey: 'tk_...'
});
```

### Remote Networks

**Get all networks:**
```typescript
const networks = await client.getRemoteNetworks();
console.log(`Found ${networks.length} networks`);

networks.forEach(net => {
  console.log(`${net.name} (${net.location}) - ${net.id}`);
});
```

**Find network by exact name:**
```typescript
const network = await client.findRemoteNetwork('production');
if (network) {
  console.log(`Network ID: ${network.id}`);
}
```

**Find network by partial match:**
```typescript
const network = await client.findRemoteNetworkByTerm('prod');
// Matches "production", "prod-vpc", "staging-prod", etc.
```

**Get or create network:**
```typescript
const network = await client.getOrCreateRemoteNetwork('staging');
console.log(`Network ${network.id} ready (${network.name})`);
```

### Connectors

**Create connector:**
```typescript
const network = await client.getOrCreateRemoteNetwork('vpc-01');
const connector = await client.createConnector(network.id, 'vpc-connector-01');
console.log(`Connector created: ${connector.id}`);
```

**Generate deployment tokens:**
```typescript
const tokens = await client.generateConnectorTokens(connector.id);

console.log(`Access Token: ${tokens.accessToken}`);
console.log(`Refresh Token: ${tokens.refreshToken}`);

// Use these tokens in Docker deployment:
// docker run -e TWINGATE_ACCESS_TOKEN=${tokens.accessToken} ...
```

**Find existing connector:**
```typescript
const connector = await client.findConnector('vpc-connector-01');
if (connector) {
  console.log(`State: ${connector.state}`);
}
```

### Groups

**Get all groups:**
```typescript
const groups = await client.getGroups();
groups.forEach(g => console.log(`${g.name} - ${g.id}`));
```

**Find specific group:**
```typescript
const engineering = await client.findGroup('engineering');
if (engineering) {
  console.log(`Engineering group: ${engineering.id}`);
}
```

**Get "Everyone" group:**
```typescript
const everyone = await client.getEveryoneGroup();
// Common pattern: assign broad access
```

### Resources

**Create resource with TCP port restrictions:**
```typescript
const resource = await client.createResource(
  'banking-api',
  '127.0.0.1',
  networkId,
  {
    alias: 'banking.internal',
    protocols: {
      allowIcmp: false,
      tcp: {
        policy: 'RESTRICTED',
        ports: [{ start: 3030, end: 3030 }]
      }
    }
  }
);

console.log(`Resource created: ${resource.id}`);
console.log(`Access via: banking.internal:3030`);
```

**Assign Everyone group to resource:**
```typescript
await client.assignEveryoneGroupToResource(resource.id);
// Now all users in Twingate network can access this resource
```

**Assign specific groups:**
```typescript
await client.assignResourceAccess(resource.id, [groupId1, groupId2]);
```

---

## Configuration

### Environment Variables

**Required:**
```bash
TWINGATE_NETWORK_NAME="your-network"  # e.g., "acme-corp"
TWINGATE_API_KEY="tk_..."             # Admin API key
```

**Get API Key:**
1. Log in to Twingate Admin Console
2. Navigate to Settings → API
3. Create new API key with admin permissions
4. Copy key (starts with `tk_`)
5. Add to `.env`

**Network Name:**
- Found in your Twingate URL: `https://[network-name].twingate.com`
- Example: If URL is `https://acme-corp.twingate.com`, use `acme-corp`

### Client Options

```typescript
interface TwingateConfig {
  networkName?: string;  // Defaults to TWINGATE_NETWORK_NAME
  apiKey?: string;       // Defaults to TWINGATE_API_KEY
}
```

---

## API Reference

### TwingateGraphQLClient Class

#### `constructor(config?: TwingateConfig)`

Create new client instance.

**Throws:** Error if TWINGATE_NETWORK_NAME or TWINGATE_API_KEY missing

---

#### Remote Networks

##### `getRemoteNetworks(): Promise<RemoteNetwork[]>`

Get all remote networks (cached for 60s).

**Returns:** Array of remote network objects

**Example:**
```typescript
const networks = await client.getRemoteNetworks();
```

---

##### `findRemoteNetwork(name: string): Promise<RemoteNetwork | null>`

Find network by exact name.

**Parameters:**
- `name` - Exact network name (case-sensitive)

**Returns:** Network object or `null` if not found

---

##### `findRemoteNetworkByTerm(searchTerm: string): Promise<RemoteNetwork | null>`

Find network by partial name match.

**Parameters:**
- `searchTerm` - Partial network name (case-insensitive)

**Returns:** First matching network or `null`

**Example:**
```typescript
const network = await client.findRemoteNetworkByTerm('prod');
// Matches "production", "prod-vpc", etc.
```

---

##### `getOrCreateRemoteNetwork(name: string): Promise<RemoteNetwork>`

Get existing network or create if doesn't exist.

**Parameters:**
- `name` - Network name

**Returns:** Network object (existing or newly created)

**Example:**
```typescript
const network = await client.getOrCreateRemoteNetwork('staging');
```

---

#### Connectors

##### `createConnector(networkId: string, name: string): Promise<Connector>`

Create new connector in remote network.

**Parameters:**
- `networkId` - Remote network ID
- `name` - Connector name

**Returns:** Connector object

---

##### `generateConnectorTokens(connectorId: string): Promise<ConnectorTokens>`

Generate access/refresh tokens for connector deployment.

**Parameters:**
- `connectorId` - Connector ID

**Returns:**
```typescript
interface ConnectorTokens {
  accessToken: string;   // Use in TWINGATE_ACCESS_TOKEN
  refreshToken: string;  // Use in TWINGATE_REFRESH_TOKEN
}
```

**Example:**
```typescript
const tokens = await client.generateConnectorTokens(connectorId);
// Deploy with: TWINGATE_ACCESS_TOKEN=${tokens.accessToken}
```

---

##### `findConnector(name: string): Promise<Connector | null>`

Find connector by name.

**Parameters:**
- `name` - Connector name

**Returns:** Connector object or `null`

---

##### `getConnectors(): Promise<Connector[]>`

Get all connectors (cached for 60s).

**Returns:** Array of connector objects

---

#### Groups

##### `getGroups(): Promise<Group[]>`

Get all groups (cached for 60s).

**Returns:** Array of group objects

---

##### `findGroup(name: string): Promise<Group | null>`

Find group by exact name.

**Parameters:**
- `name` - Group name

**Returns:** Group object or `null`

---

##### `getEveryoneGroup(): Promise<Group>`

Get the "Everyone" group (all users).

**Returns:** Everyone group object

**Throws:** Error if Everyone group doesn't exist

---

#### Resources

##### `createResource(name: string, address: string, networkId: string, options?: ResourceOptions): Promise<Resource>`

Create new resource.

**Parameters:**
- `name` - Resource display name
- `address` - IP address or hostname
- `networkId` - Remote network ID
- `options` - Optional configuration:
  - `alias` - DNS alias (e.g., "app.internal")
  - `protocols` - Protocol restrictions (TCP/UDP ports, ICMP)

**Returns:** Resource object

**Example:**
```typescript
const resource = await client.createResource(
  'NotMint Dashboard',
  '127.0.0.1',
  networkId,
  {
    alias: 'notmint.internal',
    protocols: {
      allowIcmp: false,
      tcp: {
        policy: 'RESTRICTED',
        ports: [{ start: 3030, end: 3030 }]
      }
    }
  }
);
```

---

##### `assignResourceAccess(resourceId: string, groupIds: string[]): Promise<void>`

Assign groups to resource.

**Parameters:**
- `resourceId` - Resource ID
- `groupIds` - Array of group IDs

---

##### `assignEveryoneGroupToResource(resourceId: string): Promise<void>`

Assign Everyone group to resource (convenience method).

**Parameters:**
- `resourceId` - Resource ID

**Example:**
```typescript
await client.assignEveryoneGroupToResource(resourceId);
```

---

### Type Definitions

```typescript
interface RemoteNetwork {
  id: string;
  name: string;
  location: string;
}

interface Connector {
  id: string;
  name: string;
  state: 'ALIVE' | 'DEAD_NO_HEARTBEAT' | 'DEAD_HEARTBEAT_TIMEOUT';
}

interface ConnectorTokens {
  accessToken: string;
  refreshToken: string;
}

interface Group {
  id: string;
  name: string;
}

interface Resource {
  id: string;
  name: string;
  address: { type: string; value: string; };
  alias?: string;
}

interface ProtocolInput {
  allowIcmp?: boolean;
  tcp?: {
    policy: 'ALLOW_ALL' | 'RESTRICTED' | 'DENY_ALL';
    ports?: Array<{ start: number; end: number }>;
  };
  udp?: {
    policy: 'ALLOW_ALL' | 'RESTRICTED' | 'DENY_ALL';
    ports?: Array<{ start: number; end: number }>;
  };
}
```

---

## Architecture

### Request Flow

```
TwingateGraphQLClient
   ↓
graphqlRequest(query, variables)
   ├─ Check response cache (60s TTL)
   ├─ If cached: return cached data
   └─ If not cached:
      ↓
   POST https://[network].twingate.com/api/graphql/
      Headers:
         X-API-KEY: [api-key]
         Content-Type: application/json
      Body: { query, variables }
      ↓
   Parse GraphQL response
      ├─ If errors: throw Error(errorMessages)
      └─ If success:
         ├─ Store in cache
         └─ Return data
```

### Caching Strategy

**Query operations** (cached for 60s):
- `getRemoteNetworks()`
- `getConnectors()`
- `getGroups()`

**Cache invalidation** (on mutations):
- `createConnector()` → invalidate "connectors"
- `createResource()` → invalidate "resources"
- `assignResourceAccess()` → invalidate "resources"

**Cache key format:** `[operation]:[identifier]`
- Example: `remoteNetworks:all`, `connectors:all`

### GraphQL Queries

**Remote Networks:**
```graphql
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
```

**Create Connector:**
```graphql
mutation($networkId: ID!, $name: String!) {
  connectorCreate(
    remoteNetworkId: $networkId
    name: $name
  ) {
    entity {
      id
      name
      state
    }
  }
}
```

**Generate Tokens:**
```graphql
mutation($connectorId: ID!) {
  connectorGenerateTokens(connectorId: $connectorId) {
    accessToken
    refreshToken
  }
}
```

**Create Resource:**
```graphql
mutation($input: ResourceCreateInput!) {
  resourceCreate(input: $input) {
    entity {
      id
      name
      address { type value }
    }
  }
}
```

---

## Scripts

### Connector Registration Workflow

**Complete connector setup:**
```typescript
#!/usr/bin/env bun
import { TwingateGraphQLClient } from '@/tools/twingate/client';

const client = new TwingateGraphQLClient();

// 1. Get or create remote network
const network = await client.getOrCreateRemoteNetwork('chronos-pc-network');
console.log(`Network: ${network.name} (${network.id})`);

// 2. Create connector
const connector = await client.createConnector(network.id, 'chronos-pc-connector');
console.log(`Connector: ${connector.name} (${connector.id})`);

// 3. Generate tokens
const tokens = await client.generateConnectorTokens(connector.id);
console.log(`\nDeployment tokens:`);
console.log(`Access: ${tokens.accessToken}`);
console.log(`Refresh: ${tokens.refreshToken}`);

// 4. Docker deployment command
console.log(`\nDeploy with:`);
console.log(`docker run -d \\`);
console.log(`  -e TWINGATE_ACCESS_TOKEN="${tokens.accessToken}" \\`);
console.log(`  -e TWINGATE_REFRESH_TOKEN="${tokens.refreshToken}" \\`);
console.log(`  twingate/connector:latest`);
```

### Resource Registration Workflow

**Register internal service:**
```typescript
#!/usr/bin/env bun
import { TwingateGraphQLClient } from '@/tools/twingate/client';

const client = new TwingateGraphQLClient();

// 1. Find remote network
const network = await client.findRemoteNetworkByTerm('production');
if (!network) throw new Error('Network not found');

// 2. Get Everyone group
const everyone = await client.getEveryoneGroup();

// 3. Create resource
const resource = await client.createResource(
  'NotMint Dashboard',
  '127.0.0.1',
  network.id,
  {
    alias: 'notmint.internal',
    protocols: {
      allowIcmp: false,
      tcp: {
        policy: 'RESTRICTED',
        ports: [{ start: 3030, end: 3030 }]
      }
    }
  }
);

console.log(`Resource: ${resource.name} (${resource.id})`);

// 4. Assign Everyone group (CRITICAL)
await client.assignEveryoneGroupToResource(resource.id);

console.log(`✅ Resource accessible at https://notmint.internal:3030`);
```

---

## Dependencies

### Runtime

**External:** None (uses Bun built-ins)

**Internal:**
- TypeScript type definitions in `types.ts`

### Framework Integration

**Used By:**
- `tools/notmint` - Personal finance dashboard zero-trust access
- `tools/monitor` - Monitoring dashboard Twingate registration

**File Structure:**
```
tools/api/twingate/
├── client.ts        # Main GraphQL client implementation
├── types.ts         # TypeScript type definitions
├── index.ts         # Module exports
├── README.md        # Legacy documentation (superseded by TOOL.md)
└── TOOL.md          # This file
```

---

## Troubleshooting

### "Missing Twingate credentials"

**Cause:** TWINGATE_NETWORK_NAME or TWINGATE_API_KEY not set

**Fix:**
```bash
# Add to .env
echo 'TWINGATE_NETWORK_NAME="your-network"' >> .env
echo 'TWINGATE_API_KEY="tk_..."' >> .env

# Verify
bun -e 'console.log(process.env.TWINGATE_NETWORK_NAME, process.env.TWINGATE_API_KEY)'
```

### "GraphQL errors: Unauthorized"

**Cause:** Invalid API key or insufficient permissions

**Fix:**
1. Verify API key is correct (starts with `tk_`)
2. Check key has admin permissions in Twingate console
3. Regenerate key if needed: Settings → API → Create Key

### "Network not found"

**Cause:** No network matches search term

**Debug:**
```typescript
// List all networks
const networks = await client.getRemoteNetworks();
console.log('Available networks:', networks.map(n => n.name));

// Try exact match
const network = await client.findRemoteNetwork('exact-name');
```

### "Connector tokens not working"

**Cause:** Tokens expire after 24 hours if not used

**Fix:**
```typescript
// Regenerate tokens
const tokens = await client.generateConnectorTokens(connectorId);

// Deploy immediately
docker run -d \
  -e TWINGATE_ACCESS_TOKEN="${tokens.accessToken}" \
  -e TWINGATE_REFRESH_TOKEN="${tokens.refreshToken}" \
  twingate/connector:latest
```

### "Resource created but not accessible"

**Cause:** No group assigned to resource

**Fix:**
```typescript
// CRITICAL: Always assign group after creating resource
await client.assignEveryoneGroupToResource(resource.id);

// Or assign specific groups
await client.assignResourceAccess(resource.id, [groupId1, groupId2]);
```

### Cache Staleness

**Cause:** 60-second cache may show outdated data

**Fix:**
```typescript
// Wait for cache to expire (60s) or clear cache manually
// Cache auto-invalidates on mutations

// Or create new client instance (fresh cache)
const freshClient = new TwingateGraphQLClient();
```

### "HTTP 429: Rate limited"

**Cause:** Too many requests to Twingate API

**Fix:**
```bash
# Add delays between requests
await new Promise(resolve => setTimeout(resolve, 1000));

# Use cache-friendly operations (getRemoteNetworks vs individual queries)
```

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

**Skills:**
- None (infrastructure-management skill removed; engineer agent uses Twingate client directly)

**Tools:**
- `tools/notmint/scripts/twingate-register.ts` — registers the NotMint dashboard as a Twingate resource

---

## Related Tools

- **tools/notmint** - Personal finance dashboard using Twingate for zero-trust access
- **tools/monitor** - Monitoring dashboard with Twingate resource registration
- **tools/api/context7** - (Complementary) API client example with caching

---

## Version History

### 1.0.0 (2026-01-29)
- ✅ Complete GraphQL client implementation
- ✅ Remote network operations (query, create, find)
- ✅ Connector management (create, generate tokens, status)
- ✅ Group operations (query, find Everyone group)
- ✅ Resource management (create, assign access)
- ✅ Response caching with 60-second TTL
- ✅ TypeScript type safety
- ✅ Environment credential loading
- ✅ Migration from legacy twingate-api.ts clients

---

## References

- **Twingate Admin API:** https://www.twingate.com/docs/api
- **GraphQL API Docs:** https://www.twingate.com/docs/api/graphql
- **Connector Deployment:** https://www.twingate.com/docs/connectors
- **Zero Trust Concepts:** https://www.twingate.com/docs/concepts/zero-trust
- **Framework README:** `tools/api/twingate/README.md` (legacy)
