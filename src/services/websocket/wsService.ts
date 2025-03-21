/**
 * @file: wsService.ts
 * @description: WebSocket service for managing real-time bidirectional communication
 *               with the trading API, handling connection lifecycle and message processing.
 *
 * @components:
 *   - WebSocketService: Singleton class implementing WebSocket functionality
 *   - wsService: Exported singleton instance
 *   - MessageHandler: Type definition for message handling callbacks
 * @dependencies:
 *   - types/websocket: WebSocketResponse and WebSocketRequest types
 *   - services/config/configService: For retrieving configuration values
 * @usage:
 *   // Connect to WebSocket with message handler
 *   wsService.connect((data) => {
 *     console.log('Received message:', data);
 *   });
 *
 *   // Send a message
 *   wsService.send({ authorize: 'TOKEN123' });
 *
 *   // Check connection status
 *   const isConnected = wsService.isConnected();
 *
 * @architecture: Singleton service with WebSocket connection management
 * @relationships:
 *   - Used by: useWebSocket hook, App component for authentication
 *   - Related to: SSE service for real-time updates
 * @dataFlow:
 *   - Connection: Establishes WebSocket connection with authentication
 *   - Messaging: Sends requests and processes responses
 *   - Lifecycle: Manages connection state and keep-alive pings
 *
 * @ai-hints: This service implements the Singleton pattern and includes automatic
 *            ping/keep-alive functionality. It handles connection state management
 *            and message parsing with error handling. The service adds request IDs
 *            to outgoing messages for tracking.
 */
import { WebSocketResponse, WebSocketRequest } from '../../types/websocket';
// Import configService if needed in the future
// import { configService } from '../config/configService';
import { API_CONFIG, API_ENDPOINTS } from '../../config/api.config';

type MessageHandler = (data: WebSocketResponse) => void;

/**
 * WebSocketService: Service for managing WebSocket connections to the trading API.
 * Implements singleton pattern and handles connection lifecycle, message processing, and keep-alive pings.
 * Methods: connect, disconnect, send, isConnected
 */
class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private messageHandler: MessageHandler | null = null;
  private pingInterval: number | null = null;
  private isConnecting = false;

  private constructor() {}
  
  /**
   * getWsUrl: Constructs the WebSocket URL with authentication parameters.
   * Inputs: None
   * Output: string - Complete WebSocket URL with authentication parameters
   */
  private getWsUrl(): string {
    // Use the new Champion API WebSocket URL
    // const baseUrl = API_CONFIG.BASE_URL;
    const baseUrl = 'https://champion.mobile-bot.deriv.dev';
    const wsEndpoint = API_ENDPOINTS.WS;
    
    // Construct URL with query parameters
    const url = new URL(`${baseUrl}${wsEndpoint}`);
    
    // Add required query parameters
    const accountUuid = API_CONFIG.ACCOUNT_UUID;
    const championUrl = API_CONFIG.CHAMPION_API_URL;
    
    url.searchParams.set('account_uuid', accountUuid);
    url.searchParams.set('champion_url', championUrl);
    
    const wsUrl = url.toString();
    
    return wsUrl;
  }

  /**
   * getInstance: Returns the singleton instance of WebSocketService.
   * Inputs: None
   * Output: WebSocketService - Singleton instance of the service
   */
  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  /**
   * startPingInterval: Starts a periodic ping to keep the WebSocket connection alive.
   * Inputs: None
   * Output: void - Sets up an interval that sends ping messages every 10 seconds
   */
  private startPingInterval(): void {
    this.clearPingInterval();
    this.pingInterval = window.setInterval(() => {
      if (this.isConnected()) {
        this.send({ ping: 1 });
      }
    }, 10000);
  }

  /**
   * clearPingInterval: Clears the ping interval timer.
   * Inputs: None
   * Output: void - Stops the ping interval if it exists
   */
  private clearPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * connect: Establishes a WebSocket connection and sets up event handlers.
   * Inputs: onMessage: MessageHandler - Callback function to handle incoming messages
   * Output: void - Creates and configures WebSocket connection with event handlers
   */
  public connect(onMessage: MessageHandler): void {
    // If already connected or connecting, just update the message handler
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) {
      this.messageHandler = onMessage;
      return;
    }

    // Prevent multiple connection attempts
    this.isConnecting = true;
    this.messageHandler = onMessage;

    // Clean up existing connection if any
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    // Create WebSocket with URL
    const wsUrl = this.getWsUrl();
    this.ws = new WebSocket(wsUrl);
    
    // Add required headers if supported by browser
    // Note: Some browsers don't support custom headers in WebSocket constructor
    if ('setRequestHeader' in this.ws) {
      // Use type assertion for non-standard WebSocket extension
      const wsWithHeaders = this.ws as unknown as {
        setRequestHeader: (name: string, value: string) => void
      };
      
      // Add only the required headers as per Postman collection
      wsWithHeaders.setRequestHeader('Authorization', `Bearer ${API_CONFIG.CHAMPION_TOKEN}`);
      wsWithHeaders.setRequestHeader('Accept', 'application/json, text/plain, */*');
      wsWithHeaders.setRequestHeader('Content-Type', 'application/json');
    } else {
      console.warn('WebSocket custom headers not supported by browser. Authentication may fail.');
    }

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.isConnecting = false;
      this.startPingInterval();
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.ws = null;
      this.isConnecting = false;
      this.clearPingInterval();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.isConnecting = false;
      this.clearPingInterval();
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketResponse;
        
        // Log the received message for debugging
        console.log('WebSocket message received:', message);
        
        // Handle Champion API specific message format
        if (this.messageHandler) {
          // Skip ping messages
          if (message.msg_type === 'ping' || message.type === 'ping') {
            console.log('WebSocket ping received');
            return;
          }
          
          // Process and forward the message
          this.messageHandler(message);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  }

  /**
   * disconnect: Closes the WebSocket connection and cleans up resources.
   * Inputs: None
   * Output: void - Closes connection, stops ping interval, and resets state
   */
  public disconnect(): void {
    this.clearPingInterval();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageHandler = null;
    this.isConnecting = false;
  }

  /**
   * send: Sends a message to the WebSocket server.
   * Inputs: payload: WebSocketRequest - The data to send to the server
   * Output: void - Sends serialized message with request ID if connection is open
   */
  public send(payload: WebSocketRequest): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      // Add Champion API required fields
      const message = {
        ...payload,
        req_id: Date.now(),
        account_uuid: API_CONFIG.ACCOUNT_UUID,
        champion_url: API_CONFIG.CHAMPION_API_URL
      };
      
      console.log('Sending WebSocket message:', message);
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  /**
   * isConnected: Checks if the WebSocket connection is currently open.
   * Inputs: None
   * Output: boolean - True if the connection is open and ready for communication
   */
  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const wsService = WebSocketService.getInstance();
