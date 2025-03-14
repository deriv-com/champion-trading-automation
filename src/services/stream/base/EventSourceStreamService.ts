import { BaseStreamService } from './BaseStreamService';
import { IStreamOptions } from '../types/stream';

/**
 * Stream service implementation using the native EventSource API
 * Closely mirrors the behavior of the original balanceStreamService
 */
export class EventSourceStreamService extends BaseStreamService {
  private eventSource: EventSource | null = null;
  private reconnectTimer: number | null = null;

  /**
   * Create an EventSource connection
   */
  protected createConnection(): void {
    if (!this.lastOptions) {
      this.isConnecting = false;
      return;
    }

    try {
      // Create a new EventSource
      this.eventSource = new EventSource(this.url);

      // Set up event handlers
      this.eventSource.onopen = this.handleOpen.bind(this);
      this.eventSource.onmessage = this.handleEventSourceMessage.bind(this);
      this.eventSource.onerror = this.handleEventSourceError.bind(this);
    } catch (error) {
      this.isConnecting = false;
      console.error('EventSource Stream: Failed to create connection', error);
    }
  }

  /**
   * Close the EventSource connection
   */
  protected async closeConnection(): Promise<void> {
    this.clearReconnectTimer();
    
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  /**
   * Handle connection open event
   */
  private handleOpen(event: Event): void {
    this._isConnected = true;
    this.isConnecting = false;
    
    if (this.lastOptions?.onOpen) {
      this.lastOptions.onOpen(event);
    }
  }

  /**
   * Handle EventSource message event
   */
  private handleEventSourceMessage(event: MessageEvent): void {
    try {
      // Call the base class handler which will notify all registered handlers
      this.handleMessage(event);
    } catch (error) {
      console.error('EventSource Stream: Error processing message', error);
    }
  }

  /**
   * Handle EventSource error event
   * Implements the same reconnection logic as the original balanceStreamService
   */
  private handleEventSourceError(error: Event): void {
    console.error('EventSource Stream: Connection error', error);
    this._isConnected = false;
    
    // Call error handlers if provided
    if (this.lastOptions?.onError) {
      this.lastOptions.onError(error);
    }
    
    // Try to reconnect after a delay (matching original balanceStreamService behavior)
    this.scheduleReconnect();
  }

  /**
   * Schedule a reconnection attempt
   */
  private scheduleReconnect(): void {
    this.clearReconnectTimer();
    
    // Use the same 5000ms delay as the original balanceStreamService
    const reconnectInterval = this.lastOptions?.reconnectInterval || 5000;
    
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnect();
    }, reconnectInterval);
  }

  /**
   * Clear any pending reconnect timer
   */
  private clearReconnectTimer(): void {
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * Attempt to reconnect
   */
  private reconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    
    if (this.lastOptions) {
      this.createConnection();
    }
  }
}