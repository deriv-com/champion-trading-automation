import { TradeInfo } from './trade';

// Define SSE headers as a simple Record type without extending it
export type SSEHeaders = Record<string, string>;

// Common header keys for reference
export const SSE_HEADER_KEYS = {
  AUTHORIZATION: 'Authorization',
  CHAMPION_URL: 'champion-url', // Changed to lowercase to match Postman
  ACCEPT: 'Accept',
  CACHE_CONTROL: 'Cache-Control',
  CONNECTION: 'Connection'
} as const;

export interface TradeUpdateMessage {
  login_id: string;
  symbol: string;
  error: string;
  session_id: string;
  strategy: string;
  trade_info: TradeInfo;
  is_completed: boolean;
}

export interface SSEOptions {
  url: string;
  headers: SSEHeaders;
  withCredentials?: boolean;
  onMessage?: (event: MessageEvent) => void;
  onError?: (error: Event) => void;
  onOpen?: (event: Event) => void;
  autoConnect?: boolean;
}

export interface SSEMessage<T = unknown> {
  type: string;
  data: T;
}

export interface SSEService {
  connect: (options: SSEOptions) => number;
  disconnect: () => Promise<number>;
  isConnected: () => boolean;
}
