import { BalanceData } from '../../types/balance';

// Type for the balance stream message handler
type BalanceStreamMessageHandler = (data: BalanceData) => void;

/**
 * BalanceStreamService: Dedicated service for handling balance stream connections
 * This is completely separate from the general SSE service
 */
class BalanceStreamService {
  private static instance: BalanceStreamService;
  private eventSource: EventSource | null = null;
  private messageHandlers: Set<BalanceStreamMessageHandler> = new Set();
  private isConnected: boolean = false;
  private isConnecting: boolean = false;
  private url: string = '';

  private constructor() {}

  static getInstance(): BalanceStreamService {
    if (!BalanceStreamService.instance) {
      BalanceStreamService.instance = new BalanceStreamService();
    }
    return BalanceStreamService.instance;
  }

  /**
   * Connect to the balance stream endpoint
   * @param url The URL of the balance stream endpoint
   * @param onMessage The message handler function
   * @returns The number of registered message handlers
   */
  connect(url: string, onMessage: BalanceStreamMessageHandler): number {
    // If we're already connected to this URL, just add the message handler
    if (this.isConnected && this.url === url) {
      this.messageHandlers.add(onMessage);
      return this.messageHandlers.size;
    }

    // If we're already connecting, just add the message handler
    if (this.isConnecting) {
      this.messageHandlers.add(onMessage);
      return this.messageHandlers.size;
    }

    // Start connecting
    this.isConnecting = true;
    this.url = url;

    // Close any existing connection
    this.disconnect();

    try {
      // Create a new EventSource
      this.eventSource = new EventSource(url);

      // Add the message handler
      this.messageHandlers.add(onMessage);

      // Set up event handlers
      this.eventSource.onopen = () => {
        this.isConnected = true;
        this.isConnecting = false;
      };

      this.eventSource.onmessage = (event) => {
        try {
          // Parse the JSON data
          const data = JSON.parse(event.data);
          
          // Extract the balance data
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
          
          // Call all message handlers
          this.messageHandlers.forEach(handler => {
            handler(balanceData);
          });
        } catch (error) {
          console.error('Balance Stream: Error processing message', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('Balance Stream: Connection error', error);
        this.isConnected = false;
        
        // Try to reconnect after a delay
        setTimeout(() => {
          if (this.eventSource) {
            this.eventSource.close();
            this.connect(this.url, onMessage);
          }
        }, 5000);
      };

      return this.messageHandlers.size;
    } catch (error) {
      this.isConnecting = false;
      console.error('Balance Stream: Failed to create connection', error);
      return 0;
    }
  }

  /**
   * Disconnect from the balance stream endpoint
   */
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isConnected = false;
    this.isConnecting = false;
    this.messageHandlers.clear();
  }

  /**
   * Check if the balance stream is connected
   * @returns True if connected, false otherwise
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Remove a message handler
   * @param handler The message handler to remove
   */
  removeMessageHandler(handler: BalanceStreamMessageHandler): void {
    this.messageHandlers.delete(handler);
  }

  /**
   * Disconnect and reset all state when user logs out
   */
  handleLogout(): void {
    this.disconnect();
    this.url = '';
  }
}

export const balanceStreamService = BalanceStreamService.getInstance();