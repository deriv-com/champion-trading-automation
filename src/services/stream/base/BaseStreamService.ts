import { IStreamOptions, IStreamService } from '../types/stream';

/**
 * Abstract base class for stream services
 * Handles common functionality like connection state and message handlers
 */
export abstract class BaseStreamService implements IStreamService {
  protected url: string = '';
  protected _isConnected: boolean = false;
  protected isConnecting: boolean = false;
  protected messageHandlers: Set<Function> = new Set();
  protected lastOptions: IStreamOptions | null = null;

  /**
   * Connect to a stream endpoint
   * @param options Connection options
   * @returns Number of registered handlers
   */
  connect(options: IStreamOptions): number {
    // If we're already connected to this URL, just add the message handler
    if (this._isConnected && this.lastOptions && this.lastOptions.url === options.url) {
      if (options.onMessage) {
        this.messageHandlers.add(options.onMessage);
      }
      return this.messageHandlers.size;
    }

    // If we're already connecting, just add the message handler
    if (this.isConnecting) {
      if (options.onMessage) {
        this.messageHandlers.add(options.onMessage);
      }
      return this.messageHandlers.size;
    }

    // Start connecting
    this.isConnecting = true;
    this.lastOptions = options;
    this.url = options.url;

    // Close any existing connection
    this.disconnect();

    // Add message handler
    if (options.onMessage) {
      this.messageHandlers.add(options.onMessage);
    }

    // Create the connection
    this.createConnection();

    return this.messageHandlers.size;
  }

  /**
   * Disconnect from the stream endpoint
   */
  async disconnect(): Promise<void> {
    await this.closeConnection();
    this._isConnected = false;
    this.isConnecting = false;
    this.messageHandlers.clear();
    this.lastOptions = null;
  }

  /**
   * Check if connected to the stream
   * @returns Connection status
   */
  isConnected(): boolean {
    return this._isConnected;
  }

  /**
   * Remove a message handler
   * @param handler The handler to remove
   */
  removeMessageHandler(handler: Function): void {
    this.messageHandlers.delete(handler);
  }

  /**
   * Add a message handler
   * @param handler The handler to add
   * @returns Number of registered handlers
   */
  addMessageHandler(handler: Function): number {
    this.messageHandlers.add(handler);
    return this.messageHandlers.size;
  }

  /**
   * Handle incoming messages
   * @param event The message event
   */
  protected handleMessage(event: MessageEvent): void {
    // Call all message handlers
    this.messageHandlers.forEach(handler => {
      handler(event);
    });
  }

  /**
   * Create the actual connection
   * Implemented by subclasses
   */
  protected abstract createConnection(): void;

  /**
   * Close the actual connection
   * Implemented by subclasses
   */
  protected abstract closeConnection(): void;
}