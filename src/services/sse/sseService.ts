import { SSEOptions, SSEService } from '../../types/sse';

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
      const response = await fetch(this.url, {
        method: 'GET',
        headers: {
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          ...this.headers
        },
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
      this.eventSource = new CustomEventSource(
        options.url,
        options.headers,
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
