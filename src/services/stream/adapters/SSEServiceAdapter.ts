import { SSEOptions, SSEService } from '../../../types/sse';
import { IStreamService } from '../types/stream';

/**
 * Adapter for the SSE service
 * Provides the same API as the original sseService
 */
export class SSEServiceAdapter implements SSEService {
  private streamService: IStreamService;
  private handlerMap = new Map<Function, Function>();

  constructor(streamService: IStreamService) {
    this.streamService = streamService;
  }

  /**
   * Connect to an SSE endpoint
   * @param options SSE connection options
   * @returns Number of registered handlers
   */
  connect(options: SSEOptions): number {
    const { onMessage, ...restOptions } = options;
    
    // Create a wrapper function if onMessage is provided
    let messageHandler: ((event: MessageEvent) => void) | undefined;
    
    if (onMessage) {
      messageHandler = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(new MessageEvent('message', { data: JSON.stringify(data) }));
        } catch (error) {
          console.error('SSE Service: Error processing message', error);
        }
      };
      
      // Store the mapping between the original handler and the wrapper
      this.handlerMap.set(onMessage, messageHandler);
    }
    
    // Connect using the stream service
    return this.streamService.connect({
      ...restOptions,
      onMessage: messageHandler,
      autoReconnect: true
    });
  }

  /**
   * Disconnect from the SSE endpoint
   * @returns Promise that resolves to 0
   */
  async disconnect(): Promise<number> {
    await this.streamService.disconnect();
    this.handlerMap.clear();
    return 0;
  }

  /**
   * Check if connected to the SSE endpoint
   * @returns Connection status
   */
  isConnected(): boolean {
    return this.streamService.isConnected();
  }
}