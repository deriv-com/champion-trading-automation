# Unified Stream Service

This module provides a unified streaming service for handling Server-Sent Events (SSE) connections in the application. It abstracts the connection handling and event processing for both EventSource-based and Fetch-based implementations.

## Architecture

The unified stream service follows a layered architecture with adapters to maintain backward compatibility:

```
┌─────────────────┐     ┌─────────────────┐
│ balanceService  │     │    sseService   │
└────────┬────────┘     └────────┬────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│BalanceAdapter   │     │  SSEAdapter     │
└────────┬────────┘     └────────┬────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│EventSourceStream│     │  FetchStream    │
└────────┬────────┘     └────────┬────────┘
         │                       │
         ▼                       ▼
┌───────────────────────────────────────┐
│          BaseStreamService            │
└───────────────────────────────────────┘
```

## Components

### Base Classes

- **BaseStreamService**: Abstract base class that implements common functionality for all stream services.
- **EventSourceStreamService**: Implementation using the native EventSource API.
- **FetchStreamService**: Implementation using the fetch API and stream reading.

### Adapters

- **BalanceStreamAdapter**: Adapter for the balance stream service, providing the same API as the original balanceStreamService.
- **SSEServiceAdapter**: Adapter for the SSE service, providing the same API as the original sseService.

### Factory

- **StreamFactory**: Factory for creating stream service instances.

## Usage

### Balance Stream

```typescript
import { balanceStreamService } from '../services/balance/balanceStreamService';

// Connect to the balance stream
balanceStreamService.connect(url, (balanceData) => {
  // Handle balance updates
  console.log('Balance updated:', balanceData);
});

// Check connection status
const isConnected = balanceStreamService.getConnectionStatus();

// Disconnect
balanceStreamService.disconnect();
```

### SSE Service

```typescript
import { sseService } from '../services/sse/sseService';

// Connect to an SSE endpoint
sseService.connect({
  url: 'https://api.example.com/events',
  headers: {
    'Authorization': 'Bearer token',
    // Other headers
  },
  onMessage: (event) => {
    // Handle SSE messages
    console.log('SSE message:', JSON.parse(event.data));
  }
});

// Check connection status
const isConnected = sseService.isConnected();

// Disconnect
await sseService.disconnect();
```

## Benefits

1. **Reduced Code Duplication**: Common functionality is abstracted into the base class.
2. **Improved Maintainability**: Clear separation of concerns with a layered architecture.
3. **Better Error Handling**: Consistent error handling across all stream services.
4. **Enhanced Flexibility**: Easy to add new stream implementations or adapters.
5. **Backward Compatibility**: Existing code continues to work without changes.