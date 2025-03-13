# SSE (Server-Sent Events) Service

This service provides a generic implementation for handling Server-Sent Events (SSE) connections in the application.

## Components

The SSE implementation consists of several parts:

1. **SSE Service** (`sseService.ts`)
   - Core service that handles SSE connections
   - Manages connection lifecycle
   - Provides methods for connecting, disconnecting, and checking connection status

2. **useSSE Hook** (`useSSE.ts`)
   - React hook for easy integration of SSE in components
   - Manages connection state
   - Provides typed message handling
   - Handles automatic connection and cleanup

3. **Types** (`sse.ts`)
   - TypeScript interfaces for SSE options and messages
   - Generic types for type-safe message handling

## Usage

### Basic Usage

```typescript
import { useSSE } from '../hooks/useSSE';
import { SSEMessage } from '../types/sse';

interface MyData {
  id: string;
  value: number;
}

interface MyMessage extends SSEMessage<MyData> {
  type: 'my_update';
}

function MyComponent() {
  const { isConnected } = useSSE<MyMessage>({
    url: '/api/updates',
    onMessage: (data) => {
      console.log('Received update:', data);
    },
    onError: (error) => console.error('SSE Error:', error),
    onOpen: () => console.log('SSE Connection opened')
  });

  return (
    <div>
      Connection Status: {isConnected ? 'Connected' : 'Disconnected'}
    </div>
  );
}
```

### Manual Connection Control

```typescript
function MyComponent() {
  const { isConnected, connect, disconnect } = useSSE({
    url: '/api/updates',
    autoConnect: false // Disable auto-connection
  });

  return (
    <div>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
}
```

## Configuration

The SSE service can be configured with the following options:

- `url`: The SSE endpoint URL
- `withCredentials`: Whether to include credentials in the request (default: true)
- `autoConnect`: Whether to automatically connect on component mount (default: true)
- `onMessage`: Callback for handling incoming messages
- `onError`: Callback for handling connection errors
- `onOpen`: Callback for handling connection open events

## Best Practices

1. Always type your messages using the `SSEMessage` interface
2. Clean up connections by using the `autoConnect` feature or manually calling `disconnect`
3. Handle errors appropriately using the `onError` callback
4. Use environment variables for SSE endpoint URLs
5. Consider connection status in your UI to provide feedback to users

## Error Handling

The service includes built-in error handling:

- Connection errors are passed to the `onError` callback
- Message parsing errors are logged to console
- Connection status is tracked and exposed via `isConnected`

## Security Considerations

- The service defaults to `withCredentials: true` for authenticated requests
- URLs should be configured via environment variables
- Sensitive data should be handled securely in message handlers
