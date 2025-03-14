/**
 * Common options for all stream connections
 */
export interface IStreamOptions {
  url: string;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  onMessage?: (event: MessageEvent) => void;
  onError?: (error: Event) => void;
  onOpen?: (event: Event) => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

/**
 * Core stream service interface
 */
export interface IStreamService {
  connect(options: IStreamOptions): number;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  removeMessageHandler(handler: Function): void;
  addMessageHandler(handler: Function): number;
}