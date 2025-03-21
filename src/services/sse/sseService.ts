/**
 * @file: sseService.ts
 * @description: Service for managing Server-Sent Events (SSE) connections with
 *               custom implementation for better control and error handling.
 *
 * @components:
 *   - CustomEventSource: Custom implementation of EventSource with enhanced features
 *   - SSEServiceImpl: Singleton service implementing the SSEService interface
 *   - sseService: Exported singleton instance
 * @dependencies:
 *   - types/sse: SSEOptions and SSEService interface definitions
 * @usage:
 *   // Connect to an SSE endpoint
 *   sseService.connect({
 *     url: 'https://api.example.com/events',
 *     headers: { 'Authorization': 'Bearer token' },
 *     onMessage: (event) => console.log(JSON.parse(event.data)),
 *     withCredentials: true
 *   });
 *
 *   // Disconnect from SSE
 *   sseService.disconnect();
 *
 * @architecture: Singleton service with custom EventSource implementation
 * @relationships:
 *   - Used by: useSSE hook, balance streaming services
 *   - Related to: WebSocket service for real-time communication
 * @dataFlow:
 *   - Connection: Establishes fetch-based SSE connection with headers
 *   - Processing: Parses incoming SSE data and dispatches to handlers
 *   - Management: Handles connection lifecycle and error recovery
 *
 * @ai-hints: This service uses a custom implementation of EventSource based on
 *            the Fetch API and ReadableStream for better control over headers,
 *            credentials, and connection management. It supports multiple message
 *            handlers and connection reuse.
 */
import { SSEOptions, SSEService } from '../../types/sse';
import { API_CONFIG } from '../../config/api.config';

class CustomEventSource {
  private abortController: AbortController | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private connected: boolean = false;
  private messageHandler: ((event: MessageEvent) => void) | null = null;
  private decoder = new TextDecoder();
  private buffer = '';

  constructor(
    private url: string,
    private headers: Record<string, string>,
    private withCredentials: boolean = false
  ) {}

  async connect(): Promise<void> {
    if (this.connected) {
      console.log('SSE Service: Already connected');
      return;
    }

    if (this.abortController) {
      if (!this.abortController.signal.aborted) {
        this.abortController.abort();
      }
      this.abortController = null;
    }
    this.connected = false;
    this.buffer = '';
    
    this.abortController = new AbortController();

    try {
      // Parse URL to add query parameters if they exist in the URL
      const url = new URL(this.url);
      
      // Add query parameters from the URL search params
      const urlSearchParams = new URLSearchParams(url.search);
      
      // Only add account_uuid parameter, ignore champion_url
      if (urlSearchParams.has('account_uuid')) {
        url.searchParams.set('account_uuid', urlSearchParams.get('account_uuid')!);
      }
      
      // Log the final URL for debugging
      console.log('SSE Service: Connecting to URL:', url.toString());
      
      // Ensure we have the required headers for SSE
      const headers = {
        ...this.headers,
        'Accept': this.headers['Accept'] || 'text/event-stream',
        'Cache-Control': this.headers['Cache-Control'] || 'no-cache'
      };
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
        mode: 'cors',
        credentials: this.withCredentials ? 'include' : 'omit',
        signal: this.abortController.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response has no body');
      }

      const reader = response.body.getReader();
      this.reader = reader;

      try {
        while (true) {
          if (!this.reader) {
            console.log('SSE Service: Reader was closed');
            break;
          }

          const { value, done } = await this.reader.read();
          
          if (done) {
            console.log('SSE Service: Stream complete');
            break;
          }

          const decodedText = this.decoder.decode(value, { stream: true });
          this.buffer += decodedText;
          const lines = this.buffer.split('\n');
          this.buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim() === '') continue;
            
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();

              if (!this.messageHandler) {
                console.warn('SSE Service: No message handler registered');
                continue;
              }

              if (data.includes('heartbeat')) {
                this.messageHandler(new MessageEvent('message', { 
                  data: JSON.stringify({ type: 'heartbeat' })
                }));
                continue;
              }

              try {
                // Validate JSON but pass original data
                JSON.parse(data);
                this.messageHandler(new MessageEvent('message', { data }));
              } catch (parseError) {
                console.warn('SSE Service: Invalid JSON:', data, parseError);
              }
            }
          }
        }
      } catch (streamError) {
        if (streamError instanceof Error && streamError.name === 'AbortError') {
          console.log('SSE Service: Stream reading aborted');
          return;
        }
        throw streamError;
      }

      this.connected = true;
      console.log('SSE Service: Connection established');

    } catch (connectionError) {
      this.connected = false;
      if (connectionError instanceof Error && connectionError.name === 'AbortError') {
        console.log('SSE Service: Connection aborted');
        return;
      }
      console.error('SSE Service: Connection error:', connectionError);
      throw connectionError;
    }
  }

  set onmessage(handler: (event: MessageEvent) => void) {
    this.messageHandler = handler;
  }

  async close(): Promise<void> {
    if (!this.connected) return;

    this.connected = false;
    
    if (this.reader) {
      try {
        await this.reader.cancel();
      } catch (error) {
        console.warn('SSE Service: Error canceling reader:', error);
      }
      this.reader = null;
    }

    if (this.abortController) {
      try {
        if (!this.abortController.signal.aborted) {
          this.abortController.abort();
        }
      } catch (error) {
        console.warn('SSE Service: Error aborting connection:', error);
      }
      this.abortController = null;
    }

    this.buffer = '';
  }

  get readyState(): number {
    return this.connected ? EventSource.OPEN : EventSource.CLOSED;
  }

  static get CONNECTING(): number { return 0; }
  static get OPEN(): number { return 1; }
  static get CLOSED(): number { return 2; }
}

class SSEServiceImpl implements SSEService {
  private static instance: SSEServiceImpl;
  private eventSource: CustomEventSource | null = null;
  private messageHandlers: Set<(event: MessageEvent) => void> = new Set();
  private lastOptions: SSEOptions | null = null;
  private isConnecting: boolean = false;

  private constructor() {}

  static getInstance(): SSEServiceImpl {
    if (!SSEServiceImpl.instance) {
      SSEServiceImpl.instance = new SSEServiceImpl();
    }
    return SSEServiceImpl.instance;
  }

  connect(options: SSEOptions): number {
    if (this.isConnected() && this.lastOptions &&
        this.lastOptions.url === options.url &&
        JSON.stringify(this.lastOptions.headers) === JSON.stringify(options.headers)) {
      if (options.onMessage) {
        this.messageHandlers.add(options.onMessage);
      }
      return this.messageHandlers.size;
    }

    if (this.isConnecting) {
      if (options.onMessage) {
        this.messageHandlers.add(options.onMessage);
      }
      return this.messageHandlers.size;
    }
    this.isConnecting = true;
    this.lastOptions = options;

    try {
      // Prepare URL with query parameters
      let url = options.url;
      if (options.queryParams) {
        const urlObj = new URL(url);
        // Only set the account_uuid parameter, ignore champion_url
        if (options.queryParams.account_uuid) {
          urlObj.searchParams.set('account_uuid', options.queryParams.account_uuid);
        }
        url = urlObj.toString();
      } else {
        // Add default query parameters from API_CONFIG
        const urlObj = new URL(url);
        urlObj.searchParams.set('account_uuid', API_CONFIG.ACCOUNT_UUID);
        // Don't add champion_url parameter
        url = urlObj.toString();
      }

      // Include the required headers as per Postman collection
      const headers = {
        ...options.headers,
        'Authorization': options.headers['Authorization'] || `Bearer ${API_CONFIG.CHAMPION_TOKEN}`,
        'Accept': 'text/event-stream', // Always use text/event-stream for SSE
        'Cache-Control': 'no-cache'
      };

      this.eventSource = new CustomEventSource(
        url,
        headers,
        options.withCredentials
      );

      if (options.onMessage) {
        this.messageHandlers.add(options.onMessage);
      }

      this.eventSource.onmessage = (event) => {
        this.messageHandlers.forEach(handler => handler(event));
      };

      this.eventSource.connect()
        .then(() => {
          this.isConnecting = false;
        })
        .catch(error => {
          console.error('SSE Service: Connection failed:', error);
          this.isConnecting = false;
          this.eventSource = null;
          this.messageHandlers.clear();
        });

      return this.messageHandlers.size;
    } catch (error) {
      this.isConnecting = false;
      console.error('SSE Service: Failed to create connection:', error);
      return 0;
    }
  }

  async disconnect(): Promise<number> {
    if (this.eventSource) {
      await this.eventSource.close();
      this.eventSource = null;
    }
    this.isConnecting = false;
    this.lastOptions = null;
    this.messageHandlers.clear();
    return 0;
  }

  isConnected(): boolean {
    return !this.isConnecting && this.eventSource !== null && this.eventSource.readyState === CustomEventSource.OPEN;
  }
}

export const sseService = SSEServiceImpl.getInstance();
