import { BaseStreamService } from './BaseStreamService';

/**
 * Stream service implementation using fetch API and stream reading
 * Closely mirrors the behavior of the original sseService
 */
export class FetchStreamService extends BaseStreamService {
  private abortController: AbortController | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private decoder = new TextDecoder();
  private buffer = '';

  /**
   * Create a fetch-based stream connection
   */
  protected async createConnection(): Promise<void> {
    if (!this.lastOptions) {
      this.isConnecting = false;
      return;
    }

    if (this.abortController) {
      if (!this.abortController.signal.aborted) {
        this.abortController.abort();
      }
      this.abortController = null;
    }
    
    this.buffer = '';
    this.abortController = new AbortController();

    try {
      const response = await fetch(this.url, {
        method: 'GET',
        headers: {
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          ...this.lastOptions.headers
        },
        mode: 'cors',
        credentials: this.lastOptions.withCredentials ? 'include' : 'omit',
        signal: this.abortController.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response has no body');
      }

      // Connection is established
      this._isConnected = true;
      this.isConnecting = false;
      
      if (this.lastOptions.onOpen) {
        this.lastOptions.onOpen(new Event('open'));
      }

      const reader = response.body.getReader();
      this.reader = reader;

      try {
        await this.processStream();
      } catch (streamError) {
        if (streamError instanceof Error && streamError.name === 'AbortError') {
          console.log('Fetch Stream: Stream reading aborted');
          return;
        }
        throw streamError;
      }
    } catch (connectionError) {
      this._isConnected = false;
      this.isConnecting = false;
      
      if (connectionError instanceof Error && connectionError.name === 'AbortError') {
        console.log('Fetch Stream: Connection aborted');
        return;
      }
      
      console.error('Fetch Stream: Connection error:', connectionError);
      
      // Call error handlers if provided
      if (this.lastOptions?.onError) {
        this.lastOptions.onError(new ErrorEvent('error', { error: connectionError }));
      }
    }
  }

  /**
   * Process the stream data
   */
  private async processStream(): Promise<void> {
    if (!this.reader) return;
    
    try {
      while (true) {
        if (!this.reader) {
          console.log('Fetch Stream: Reader was closed');
          break;
        }

        const { value, done } = await this.reader.read();
        
        if (done) {
          console.log('Fetch Stream: Stream complete');
          break;
        }

        this.processChunk(value);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      throw error;
    }
  }

  /**
   * Process a chunk of data from the stream
   * Follows the same parsing logic as the original sseService
   */
  private processChunk(chunk: Uint8Array): void {
    const decodedText = this.decoder.decode(chunk, { stream: true });
    this.buffer += decodedText;
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.trim() === '') continue;
      
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim();

        if (data.includes('heartbeat')) {
          this.handleMessage(new MessageEvent('message', { 
            data: JSON.stringify({ type: 'heartbeat' })
          }));
          continue;
        }

        try {
          // Validate JSON but pass original data (matching original sseService behavior)
          JSON.parse(data);
          this.handleMessage(new MessageEvent('message', { data }));
        } catch (parseError) {
          console.warn('Fetch Stream: Invalid JSON:', data, parseError);
        }
      }
    }
  }

  /**
   * Close the fetch connection
   */
  protected async closeConnection(): Promise<void> {
    if (this.reader) {
      try {
        await this.reader.cancel();
      } catch (error) {
        console.warn('Fetch Stream: Error canceling reader:', error);
      }
      this.reader = null;
    }

    if (this.abortController) {
      try {
        if (!this.abortController.signal.aborted) {
          this.abortController.abort();
        }
      } catch (error) {
        console.warn('Fetch Stream: Error aborting connection:', error);
      }
      this.abortController = null;
    }

    this.buffer = '';
  }
}