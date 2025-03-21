import { TradeInfo } from './trade';

export interface SSEHeaders {
  'Authorization': string;
  'Accept': string;
  'Content-Type'?: string;
  'Cache-Control'?: string;
  [key: string]: string | undefined;
}

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
  queryParams?: {
    account_uuid: string;
    champion_url?: string;
    [key: string]: string | undefined;
  };
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
