import { WebSocketResponse, WebSocketRequest } from '../../types/websocket';
import { configService } from '../config/configService';

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
    const wsUrl = configService.getValue('wsUrl');
    const appId = configService.getValue('oauthAppId');
    return `${wsUrl}?app_id=${appId}&l=en&brand=deriv`;
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

    this.ws = new WebSocket(this.getWsUrl());

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
        if (this.messageHandler && message.msg_type !== 'ping') {
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
      const message = {
        ...payload,
        req_id: Date.now()
      };
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
