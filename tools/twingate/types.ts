/**
 * Twingate Admin API Type Definitions
 * Shared types for all Twingate GraphQL operations
 */

export interface GraphQLResponse<T = Record<string, unknown>> {
  data?: T;
  errors?: GraphQLError[];
}

export interface GraphQLError {
  message: string;
  extensions?: {
    code?: string;
    [key: string]: string | number | boolean | Record<string, unknown> | undefined;
  };
}

export interface RemoteNetwork {
  id: string;
  name: string;
  location?: string;
}

export interface Connector {
  id: string;
  name: string;
  state: string;
  hasStatusNotificationsEnabled: boolean;
  remoteNetwork?: {
    id: string;
    name: string;
  };
}

export interface ConnectorTokens {
  accessToken: string;
  refreshToken: string;
}

export interface Group {
  id: string;
  name: string;
}

export interface Resource {
  id: string;
  name: string;
  alias: string | null;
  address: {
    value: string;
  };
}

export interface ProtocolInput {
  allowIcmp?: boolean;
  tcp?: {
    policy: 'RESTRICTED' | 'ALLOW_ALL';
    ports?: Array<{ start: number; end: number }>;
  };
  udp?: {
    policy: 'RESTRICTED' | 'ALLOW_ALL';
    ports?: Array<{ start: number; end: number }>;
  };
}

export interface AccessInput {
  principalId: string;
  [key: string]: string | number | boolean | Record<string, unknown> | undefined;
}

export interface TwingateConfig {
  networkName: string;
  apiKey: string;
}
