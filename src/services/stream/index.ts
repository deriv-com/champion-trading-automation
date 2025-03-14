import { StreamFactory, StreamType } from './base/StreamFactory';
import { BalanceStreamAdapter } from './adapters/BalanceStreamAdapter';
import { SSEServiceAdapter } from './adapters/SSEServiceAdapter';

// Create instances of the stream services using the factory
const eventSourceStream = StreamFactory.createEventSourceStream();
const fetchStream = StreamFactory.createFetchStream();

// Create adapters with the appropriate stream service
// Use EventSource for balance stream (matching current implementation)
export const balanceStreamService = new BalanceStreamAdapter(eventSourceStream);
// Use fetch-based implementation for SSE service (matching current implementation)
export const sseService = new SSEServiceAdapter(fetchStream);

// Export the base classes and types for direct use if needed
export * from './base/BaseStreamService';
export * from './base/EventSourceStreamService';
export * from './base/FetchStreamService';
export * from './base/StreamFactory';
export * from './adapters/BalanceStreamAdapter';
export * from './adapters/SSEServiceAdapter';
export * from './types/stream';