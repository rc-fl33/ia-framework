# Twingate GraphQL Client

Canonical implementation of the Twingate Admin API client. Provides a unified interface for connector management, resource assignment, and network operations.

## Installation

```bash
# Client is self-contained in this directory
import { TwingateGraphQLClient } from '@/tools/twingate/client.ts';
import type { RemoteNetwork, Connector, Group, Resource } from '@/tools/twingate/types.ts';
```

## Environment Setup

Required environment variables:

```env
TWINGATE_NETWORK_NAME=your-network-name
TWINGATE_API_KEY=your-api-key
```

## Basic Usage

```typescript
import { TwingateGraphQLClient } from '@/tools/twingate/client.ts';

// Initialize with environment variables
const client = new TwingateGraphQLClient();

// Or provide config directly
const client = new TwingateGraphQLClient({
  networkName: 'my-network',
  apiKey: 'tk_...',
});
```

## Common Operations

### Remote Networks

```typescript
// Get all networks
const networks = await client.getRemoteNetworks();

// Find network by exact name
const network = await client.findRemoteNetwork('production');

// Find network by partial match
const network = await client.findRemoteNetworkByTerm('prod');

// Get or create network
const network = await client.getOrCreateRemoteNetwork('staging');
```

### Connectors

```typescript
// Get all connectors
const connectors = await client.getConnectors();

// Find connector by name
const connector = await client.findConnector('vpc-connector-01');

// Create connector
const connector = await client.createConnector(networkId, 'my-connector');

// Generate tokens for deployment
const tokens = await client.generateConnectorTokens(connectorId);
// tokens.accessToken and tokens.refreshToken for deployment
```

### Groups

```typescript
// Get all groups
const groups = await client.getGroups();

// Find group by name
const group = await client.findGroup('engineering');

// Get the "Everyone" group (common for broad access)
const everyone = await client.getEveryoneGroup();
```

### Resources

```typescript
// Create resource with TCP port restrictions
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
        ports: [{ start: 3030, end: 3030 }],
      },
    },
  }
);

// Assign Everyone group to resource
await client.assignEveryoneGroupToResource(resourceId);

// Assign specific group(s)
await client.assignResourceAccess(resourceId, [groupId1, groupId2]);
```

## Complete Workflows

### Connector Registration Workflow

```typescript
const client = new TwingateGraphQLClient();

// 1. Get or create remote network
const network = await client.getOrCreateRemoteNetwork('chronos-pc-network');

// 2. Create connector
const connector = await client.createConnector(network.id, 'chronos-pc-connector');

// 3. Generate tokens
const tokens = await client.generateConnectorTokens(connector.id);

// 4. Use tokens in deployment
console.log(`Access Token: ${tokens.accessToken}`);
console.log(`Refresh Token: ${tokens.refreshToken}`);
```

### Resource Registration Workflow

```typescript
const client = new TwingateGraphQLClient();

// 1. Find remote network (where connector runs)
const network = await client.findRemoteNetworkByTerm('production');
if (!network) throw new Error('Network not found');

// 2. Get Everyone group
const everyone = await client.getEveryoneGroup();

// 3. Create resource
const resource = await client.createResource(
  'NotMint',
  '127.0.0.1',
  network.id,
  {
    alias: 'notmint.internal',
    protocols: {
      allowIcmp: false,
      tcp: {
        policy: 'RESTRICTED',
        ports: [{ start: 3030, end: 3030 }],
      },
    },
  }
);

// 4. Assign Everyone group (CRITICAL - without this, resource is unreachable)
await client.assignEveryoneGroupToResource(resource.id);

console.log('Resource registered and accessible to all users');
```

## Error Handling

All methods throw on error with descriptive messages:

```typescript
try {
  const network = await client.findRemoteNetwork('nonexistent');
  if (!network) {
    console.log('Network not found');
  }
} catch (error) {
  console.error('API error:', error.message);
}
```

## Type Definitions

See `types.ts` for complete type definitions:

- `TwingateConfig` - Client configuration
- `RemoteNetwork` - Remote network entity
- `Connector` - Connector entity and state
- `ConnectorTokens` - Access/refresh tokens for deployment
- `Group` - User group for access control
- `Resource` - Protected resource/application
- `ProtocolInput` - Protocol and port restrictions

## Migration Guide

### From `twingate-connector-create.ts`

```typescript
// Old code
const api = new TwingateConnectorAPI();
await api.register(connectorName, networkName);

// New code
const client = new TwingateGraphQLClient();
const network = await client.getOrCreateRemoteNetwork(networkName);
const connector = await client.createConnector(network.id, connectorName);
const tokens = await client.generateConnectorTokens(connector.id);
```

### From `twingate-register.ts`

```typescript
// Old code
const api = new TwingateAPI();
await api.register(networkSearchTerm);

// New code
const client = new TwingateGraphQLClient();
const network = await client.findRemoteNetworkByTerm(networkSearchTerm);
const everyone = await client.getEveryoneGroup();
const resource = await client.createResource(name, address, network.id, options);
await client.assignResourceAccess(resource.id, [everyone.id]);
```

## Implementation Notes

- All GraphQL requests include proper error handling and type safety
- Credential loading follows security best practices (environment variables only)
- Methods are modular and composable for complex workflows
- Pagination is handled automatically for queries returning multiple items
- All API operations are async/await compatible
