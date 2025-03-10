# Hooks

This directory contains custom React hooks used throughout the Champion Trading Automation application.

## Overview

Custom hooks in React allow you to extract component logic into reusable functions. The hooks in this directory encapsulate complex logic related to external services, state management, and UI interactions.

## Available Hooks

### useSSE

**Purpose**: Manages Server-Sent Events (SSE) connections for real-time updates from the server.

**Implementation Details**:
- Located at `src/hooks/useSSE.ts`
- Uses the native `EventSource` API for SSE connections
- Implements a state machine for connection status management
- Uses React's `useEffect` for lifecycle management
- Implements exponential backoff for reconnection attempts
- Maintains an event buffer with configurable size

**Configuration Options**:
```typescript
interface SSEOptions {
  // The SSE endpoint URL
  url?: string;
  
  // Types of events to listen for
  eventTypes?: string[];
  
  // Whether to connect automatically on mount
  autoConnect?: boolean;
  
  // Maximum number of events to keep in the buffer
  bufferSize?: number;
  
  // Maximum number of reconnection attempts
  reconnectAttempts?: number;
  
  // Base interval for reconnection attempts (ms)
  reconnectInterval?: number;
  
  // Callback for received events
  onEvent?: (event: SSEEvent) => void;
  
  // Callback for connection status changes
  onStatusChange?: (status: SSEConnectionStatus) => void;
}
```

**Return Value**:
```typescript
interface SSEHookResult {
  // Array of received events
  events: SSEEvent[];
  
  // Current connection status
  connectionStatus: SSEConnectionStatus;
  
  // Function to establish a connection
  connect: (url?: string) => void;
  
  // Function to close the connection
  disconnect: () => void;
  
  // Function to clear the event buffer
  clearEvents: () => void;
  
  // Last error that occurred
  error: Error | null;
}
```

**Key Features**:
- Establishes and maintains SSE connections
- Handles connection state (connecting, connected, disconnected, error)
- Provides automatic reconnection with configurable retry logic
- Parses and provides event data to components
- Buffers events with configurable size limit
- Cleans up connections when components unmount
- Supports multiple event types
- Provides error handling and reporting

**Internal Implementation**:
```typescript
// Simplified implementation
function useSSE(options: SSEOptions = {}): SSEHookResult {
  const [events, setEvents] = useState<SSEEvent[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<SSEConnectionStatus>(
    SSEConnectionStatus.DISCONNECTED
  );
  const [error, setError] = useState<Error | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  
  // Connection management logic
  const connect = useCallback((url?: string) => {
    // Implementation details...
  }, [/* dependencies */]);
  
  const disconnect = useCallback(() => {
    // Implementation details...
  }, [/* dependencies */]);
  
  // Event handling logic
  const handleEvent = useCallback((event: MessageEvent) => {
    // Implementation details...
  }, [/* dependencies */]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);
  
  // Auto-connect if enabled
  useEffect(() => {
    if (options.autoConnect && options.url) {
      connect(options.url);
    }
  }, [options.autoConnect, options.url, connect]);
  
  return {
    events,
    connectionStatus,
    connect,
    disconnect,
    clearEvents: () => setEvents([]),
    error
  };
}
```

**Usage Example**:
```typescript
import { useSSE } from '../hooks/useSSE';

function TradeUpdates() {
  const { 
    events, 
    connectionStatus, 
    connect, 
    disconnect 
  } = useSSE({
    url: 'https://api.example.com/events',
    eventTypes: ['trade', 'market'],
    autoConnect: true,
    bufferSize: 100,
    reconnectAttempts: 5,
    reconnectInterval: 2000,
    onEvent: (event) => {
      console.log('Received event:', event);
    }
  });

  // Filter for trade events only
  const tradeEvents = events.filter(event => event.type === 'trade');
  
  // Use SSE data and connection status
  return (
    <div className="trade-updates">
      <div className="connection-status">
        Status: <span className={`status-${connectionStatus.toLowerCase()}`}>
          {connectionStatus}
        </span>
      </div>
      
      <div className="controls">
        <button 
          onClick={disconnect} 
          disabled={connectionStatus === 'DISCONNECTED'}
        >
          Disconnect
        </button>
        <button 
          onClick={() => connect('https://api.example.com/events')} 
          disabled={connectionStatus === 'CONNECTED' || connectionStatus === 'CONNECTING'}
        >
          Reconnect
        </button>
      </div>
      
      <h3>Recent Trade Events ({tradeEvents.length})</h3>
      <ul className="event-list">
        {tradeEvents.map((event, index) => (
          <li key={index} className="event-item">
            <span className="event-time">
              {new Date(event.timestamp).toLocaleTimeString()}
            </span>
            <span className="event-symbol">{event.data.symbol}</span>
            <span className="event-price">{event.data.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Common Use Cases**:
1. Real-time trade updates
2. Live market data streaming
3. Notification systems
4. Activity feeds
5. Live dashboard updates

### useWebSocket

**Purpose**: Manages WebSocket connections for bidirectional real-time communication.

**Implementation Details**:
- Located at `src/hooks/useWebSocket.ts`
- Uses the native `WebSocket` API
- Implements connection state management
- Uses React's `useRef` and `useEffect` for lifecycle management
- Implements heartbeat mechanism to detect stale connections
- Provides automatic reconnection with exponential backoff
- Supports message type handling with TypeScript generics

**Configuration Options**:
```typescript
interface WebSocketOptions<T> {
  // The WebSocket endpoint URL
  url?: string;
  
  // Whether to connect automatically on mount
  autoConnect?: boolean;
  
  // Protocols to use for the WebSocket connection
  protocols?: string | string[];
  
  // Maximum number of reconnection attempts
  reconnectAttempts?: number;
  
  // Base interval for reconnection attempts (ms)
  reconnectInterval?: number;
  
  // Heartbeat interval (ms)
  heartbeatInterval?: number;
  
  // Heartbeat timeout (ms)
  heartbeatTimeout?: number;
  
  // Callback for received messages
  onMessage?: (message: T) => void;
  
  // Callback for connection open
  onOpen?: (event: Event) => void;
  
  // Callback for connection close
  onClose?: (event: CloseEvent) => void;
  
  // Callback for connection errors
  onError?: (event: Event) => void;
}
```

**Return Value**:
```typescript
interface WebSocketHookResult<T> {
  // Whether the connection is established
  isConnected: boolean;
  
  // The last received message
  lastMessage: T | null;
  
  // Function to send a message
  send: (data: any) => void;
  
  // Function to establish a connection
  connect: (url?: string, protocols?: string | string[]) => void;
  
  // Function to close the connection
  disconnect: (code?: number, reason?: string) => void;
  
  // All received messages
  messages: T[];
  
  // Current connection status
  connectionStatus: WSConnectionStatus;
  
  // Last error that occurred
  error: Event | null;
}
```

**Key Features**:
- Establishes and maintains WebSocket connections
- Handles connection state (connecting, connected, disconnected, error)
- Provides automatic reconnection with configurable retry logic
- Parses and provides message data to components
- Provides methods for sending messages
- Implements heartbeat mechanism to detect stale connections
- Cleans up connections when components unmount
- Supports binary data
- Provides error handling and reporting

**Internal Implementation**:
```typescript
// Simplified implementation
function useWebSocket<T = any>(options: WebSocketOptions<T> = {}): WebSocketHookResult<T> {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<T | null>(null);
  const [messages, setMessages] = useState<T[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<WSConnectionStatus>(
    WSConnectionStatus.DISCONNECTED
  );
  const [error, setError] = useState<Event | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  
  // Connection management logic
  const connect = useCallback((url?: string, protocols?: string | string[]) => {
    // Implementation details...
  }, [/* dependencies */]);
  
  const disconnect = useCallback((code?: number, reason?: string) => {
    // Implementation details...
  }, [/* dependencies */]);
  
  // Message handling logic
  const handleMessage = useCallback((event: MessageEvent) => {
    // Implementation details...
  }, [/* dependencies */]);
  
  // Heartbeat logic
  const startHeartbeat = useCallback(() => {
    // Implementation details...
  }, [/* dependencies */]);
  
  // Send message function
  const send = useCallback((data: any) => {
    // Implementation details...
  }, [/* dependencies */]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (heartbeatTimeoutRef.current) {
        clearTimeout(heartbeatTimeoutRef.current);
      }
    };
  }, []);
  
  // Auto-connect if enabled
  useEffect(() => {
    if (options.autoConnect && options.url) {
      connect(options.url, options.protocols);
    }
  }, [options.autoConnect, options.url, options.protocols, connect]);
  
  return {
    isConnected,
    lastMessage,
    send,
    connect,
    disconnect,
    messages,
    connectionStatus,
    error
  };
}
```

**Usage Example**:
```typescript
import { useWebSocket } from '../hooks/useWebSocket';
import { useState } from 'react';

// Define the expected message type
interface TradeMessage {
  type: 'price_update' | 'trade_executed' | 'error';
  symbol: string;
  price?: number;
  amount?: number;
  timestamp: number;
  error?: string;
}

function TradingTerminal() {
  const [symbol, setSymbol] = useState('BTC/USD');
  const [amount, setAmount] = useState(0.1);
  
  const { 
    isConnected, 
    lastMessage, 
    send, 
    connect, 
    disconnect,
    connectionStatus,
    error
  } = useWebSocket<TradeMessage>({
    url: 'wss://api.example.com/trading',
    autoConnect: true,
    reconnectAttempts: 5,
    reconnectInterval: 3000,
    heartbeatInterval: 30000,
    onMessage: (message) => {
      if (message.type === 'error') {
        console.error('Trading error:', message.error);
      }
    },
    onOpen: () => {
      console.log('Trading connection established');
      // Subscribe to specific symbols
      send({ type: 'subscribe', symbols: ['BTC/USD', 'ETH/USD'] });
    }
  });

  const executeTrade = (direction: 'buy' | 'sell') => {
    if (!isConnected) {
      alert('Not connected to trading server');
      return;
    }
    
    send({
      type: 'execute_trade',
      symbol,
      amount,
      direction
    });
  };
  
  return (
    <div className="trading-terminal">
      <div className="connection-status">
        Status: <span className={`status-${connectionStatus.toLowerCase()}`}>
          {connectionStatus}
        </span>
        {error && <span className="error-message">Error: {error.type}</span>}
      </div>
      
      <div className="trade-form">
        <select 
          value={symbol} 
          onChange={(e) => setSymbol(e.target.value)}
        >
          <option value="BTC/USD">BTC/USD</option>
          <option value="ETH/USD">ETH/USD</option>
        </select>
        
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(Number(e.target.value))} 
          step="0.01" 
          min="0.01"
        />
        
        <div className="trade-buttons">
          <button 
            onClick={() => executeTrade('buy')} 
            disabled={!isConnected}
            className="buy-button"
          >
            Buy
          </button>
          <button 
            onClick={() => executeTrade('sell')} 
            disabled={!isConnected}
            className="sell-button"
          >
            Sell
          </button>
        </div>
      </div>
      
      {lastMessage && lastMessage.type === 'price_update' && (
        <div className="price-update">
          <h3>{lastMessage.symbol} Price Update</h3>
          <p className="price">{lastMessage.price}</p>
          <p className="timestamp">
            {new Date(lastMessage.timestamp).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}
```

**Common Use Cases**:
1. Real-time trading platforms
2. Live chat applications
3. Collaborative editing tools
4. Real-time dashboards
5. Multiplayer games
6. Notification systems

## Hook Composition Patterns

Hooks can be composed together to create more complex functionality. Here are some common patterns used in this application:

### Basic Composition

Combining multiple hooks to create a new hook with enhanced functionality:

```typescript
function useTradeMonitor(symbol: string) {
  // Compose multiple hooks
  const websocket = useWebSocket<TradeMessage>({
    url: `wss://api.example.com/trades/${symbol}`,
    autoConnect: true
  });
  
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  
  // Use the composed hooks together
  useEffect(() => {
    if (websocket.lastMessage?.type === 'trade_executed') {
      setTradeHistory(prev => [
        {
          id: `trade-${Date.now()}`,
          symbol: websocket.lastMessage.symbol,
          price: websocket.lastMessage.price || 0,
          amount: websocket.lastMessage.amount || 0,
          timestamp: new Date(websocket.lastMessage.timestamp).toISOString()
        },
        ...prev
      ].slice(0, 100)); // Keep only the last 100 trades
    }
  }, [websocket.lastMessage]);
  
  return {
    ...websocket,
    tradeHistory
  };
}
```

### Conditional Hook Usage

Using hooks conditionally based on configuration:

```typescript
function useRealTimeData(options: {
  dataSource: 'websocket' | 'sse';
  endpoint: string;
}) {
  // Use different hooks based on configuration
  const websocketData = useWebSocket({
    url: options.dataSource === 'websocket' ? options.endpoint : undefined,
    autoConnect: options.dataSource === 'websocket'
  });
  
  const sseData = useSSE({
    url: options.dataSource === 'sse' ? options.endpoint : undefined,
    autoConnect: options.dataSource === 'sse'
  });
  
  // Return the appropriate data based on the selected source
  return options.dataSource === 'websocket' ? websocketData : sseData;
}
```

### Higher-Order Hooks

Creating hooks that enhance other hooks:

```typescript
function withLogging<T extends (...args: any[]) => any>(
  useHook: T
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>) => {
    const result = useHook(...args);
    
    useEffect(() => {
      console.log(`Hook ${useHook.name} rendered with args:`, args);
      console.log(`Hook ${useHook.name} result:`, result);
    });
    
    return result;
  };
}

// Usage
const useWebSocketWithLogging = withLogging(useWebSocket);
```

## Best Practices

### Hook Design Principles

1. **Single Responsibility**: Each hook should focus on a specific piece of functionality.

2. **Composability**: Hooks should be designed to work well together and be composed into more complex hooks when needed.

3. **Minimal Dependencies**: Hooks should minimize dependencies on external libraries and other hooks.

4. **Clean Lifecycle Management**: Hooks should properly clean up resources (event listeners, timers, connections) when components unmount.

5. **Consistent Error Handling**: Hooks should handle errors gracefully and provide error information to consuming components.

### TypeScript Integration

1. **Generic Types**: Use generic types where appropriate to make hooks more flexible and type-safe.

2. **Return Type Definitions**: Clearly define the structure of objects returned by hooks.

3. **Configuration Options**: Use TypeScript interfaces to define hook configuration options.

### Testing

Hooks are tested using React Testing Library and Jest:

1. **Isolation**: Test hooks in isolation using the `renderHook` utility.

2. **Mock Dependencies**: Mock external dependencies like WebSocket and EventSource.

3. **Test Edge Cases**: Test error conditions, reconnection logic, and other edge cases.

4. **Async Testing**: Use async/await and act() for testing asynchronous behavior.

## Creating New Hooks

When creating new hooks:

1. Follow the naming convention `use[Feature]`
2. Include TypeScript interfaces for parameters and return values
3. Document the hook with JSDoc comments
4. Write tests covering the hook's functionality
5. Consider composing from existing hooks when appropriate
