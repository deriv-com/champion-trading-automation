import { BalanceData } from '../../../types/balance';
import { IStreamService } from '../types/stream';

// Type for the balance stream message handler
type BalanceStreamMessageHandler = (data: BalanceData) => void;

/**
 * Adapter for the balance stream service
 * Provides the same API as the original balanceStreamService
 */
export class BalanceStreamAdapter {
  private streamService: IStreamService;
  private url: string = '';
  private handlerMap = new Map<BalanceStreamMessageHandler, Function>();

  constructor(streamService: IStreamService) {
    this.streamService = streamService;
  }

  /**
   * Connect to the balance stream endpoint
   * @param url The URL of the balance stream endpoint
   * @param onMessage The message handler function
   * @returns The number of registered message handlers
   */
  connect(url: string, onMessage: BalanceStreamMessageHandler): number {
    this.url = url;
    
    // Create a wrapper function to transform the data
    const messageHandler = (event: MessageEvent) => {
      try {
        // Parse the JSON data
        const data = JSON.parse(event.data);
        
        // Extract the balance data using the same logic as the original balanceStreamService
        let balanceData: BalanceData;
        
        if (data && data.data && data.data.balance) {
          // Structure from SSE service
          balanceData = {
            balance: data.data.balance,
            change: data.data.change || '0.00',
            contract_id: data.data.contract_id || '',
            currency: data.data.currency || 'USD',
            timestamp: data.data.timestamp || new Date().toISOString()
          };
        } else if (data && data.balance) {
          // Direct balance object
          balanceData = {
            balance: data.balance,
            change: data.change || '0.00',
            contract_id: data.contract_id || '',
            currency: data.currency || 'USD',
            timestamp: data.timestamp || new Date().toISOString()
          };
        } else {
          console.error('Balance Stream: Invalid data format', data);
          return;
        }
        
        // Call the original handler with the transformed data
        onMessage(balanceData);
      } catch (error) {
        console.error('Balance Stream: Error processing message', error);
      }
    };
    
    // Store the mapping between the original handler and the wrapper
    this.handlerMap.set(onMessage, messageHandler);
    
    // Connect using the stream service
    return this.streamService.connect({
      url,
      onMessage: messageHandler
    });
  }

  /**
   * Disconnect from the balance stream endpoint
   */
  disconnect(): void {
    this.streamService.disconnect();
    this.handlerMap.clear();
  }

  /**
   * Check if the balance stream is connected
   * @returns True if connected, false otherwise
   */
  getConnectionStatus(): boolean {
    return this.streamService.isConnected();
  }

  /**
   * Remove a message handler
   * @param handler The message handler to remove
   */
  removeMessageHandler(handler: BalanceStreamMessageHandler): void {
    const wrappedHandler = this.handlerMap.get(handler);
    if (wrappedHandler) {
      this.streamService.removeMessageHandler(wrappedHandler);
      this.handlerMap.delete(handler);
    }
  }

  /**
   * Disconnect and reset all state when user logs out
   */
  handleLogout(): void {
    this.disconnect();
    this.url = '';
  }
}