import { EventSourceStreamService } from './EventSourceStreamService';
import { FetchStreamService } from './FetchStreamService';
import { BaseStreamService } from './BaseStreamService';

/**
 * Stream type enum
 */
export enum StreamType {
  EVENT_SOURCE,
  FETCH
}

/**
 * Factory for creating stream services
 */
export class StreamFactory {
  /**
   * Create an EventSource-based stream service
   * @returns A new EventSourceStreamService instance
   */
  static createEventSourceStream(): EventSourceStreamService {
    return new EventSourceStreamService();
  }
  
  /**
   * Create a fetch-based stream service
   * @returns A new FetchStreamService instance
   */
  static createFetchStream(): FetchStreamService {
    return new FetchStreamService();
  }
  
  /**
   * Create a stream service based on the specified type
   * @param type The type of stream service to create
   * @returns A new stream service instance
   */
  static createStreamService(type: StreamType): BaseStreamService {
    switch (type) {
      case StreamType.EVENT_SOURCE:
        return StreamFactory.createEventSourceStream();
      case StreamType.FETCH:
        return StreamFactory.createFetchStream();
      default:
        throw new Error(`Unknown stream type: ${type}`);
    }
  }
}