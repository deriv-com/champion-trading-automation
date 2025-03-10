# Services

This directory contains service modules that handle external interactions, API calls, and other non-UI functionality for the Champion Trading Automation application.

## Overview

Services in this application follow the service layer pattern, encapsulating business logic and external interactions. They provide a clean API for components to interact with external systems without being concerned with implementation details.

## Structure

Each service is organized in its own directory and typically includes:

- Main service file (e.g., `apiService.ts`, `oauthService.ts`)
- Type definitions (when not in the global types directory)
- Configuration files (when needed)
- README.md (for services with complex functionality)

## Available Services

### API Service (`/api/apiService.ts`)

Handles HTTP requests to backend APIs using Axios.

**Key Features:**
- Singleton pattern implementation
- Axios instance with default configuration
- Request/response interceptors for logging and error handling
- Authentication header management
- Methods for all HTTP verbs (GET, POST, PUT, DELETE, PATCH)

**Usage:**
```typescript
import { apiService } from '../services/api/apiService';

// GET request
const data = await apiService.get<ResponseType>('/endpoint', { param: 'value' });

// POST request
const result = await apiService.post<ResponseType>('/endpoint', { data: 'value' });
```

### Config Service (`/config/configService.ts`)

Manages application configuration settings.

**Key Features:**
- Environment-specific configuration
- Runtime configuration updates
- Configuration validation

**Usage:**
```typescript
import { configService } from '../services/config/configService';

const apiUrl = configService.getApiUrl();
configService.updateConfig({ apiUrl: 'https://new-api.example.com' });
```

### OAuth Service (`/oauth/oauthService.ts`)

Handles authentication and authorization flows.

**Key Features:**
- OAuth 2.0 authentication flow
- Token management (acquisition, refresh, storage)
- Login/logout functionality
- Authentication state persistence

**Usage:**
```typescript
import { oauthService } from '../services/oauth/oauthService';

// Initiate login flow
oauthService.initiateLogin();

// Get current auth parameters
const authParams = oauthService.getAuthParams();

// Logout
oauthService.logout();
```

### SSE Service (`/sse/sseService.ts`)

Manages Server-Sent Events connections for real-time updates.

**Key Features:**
- EventSource connection management
- Automatic reconnection handling
- Event parsing and distribution
- Connection state tracking

**Usage:**
```typescript
import { sseService } from '../services/sse/sseService';

// Connect to SSE endpoint
sseService.connect('https://api.example.com/events');

// Subscribe to events
const unsubscribe = sseService.subscribe('event-type', (event) => {
  // Handle event data
});

// Disconnect
sseService.disconnect();
```

### Trade Service (`/trade/tradeService.ts`)

Handles trading operations and trade management.

**Key Features:**
- Trade execution
- Position management
- Trade history tracking
- Trade parameter validation

**Usage:**
```typescript
import { tradeService } from '../services/trade/tradeService';

// Execute a trade
const tradeResult = await tradeService.executeTrade({
  symbol: 'BTC/USD',
  amount: 0.1,
  direction: 'buy'
});

// Get open positions
const positions = await tradeService.getPositions();
```

### WebSocket Service (`/websocket/wsService.ts`)

Manages WebSocket connections for real-time communication.

**Key Features:**
- WebSocket connection management
- Automatic reconnection
- Message parsing and handling
- Connection state tracking
- Heartbeat mechanism

**Usage:**
```typescript
import { wsService } from '../services/websocket/wsService';

// Connect to WebSocket endpoint
wsService.connect('wss://api.example.com/ws');

// Send a message
wsService.send({ type: 'subscribe', channel: 'trades' });

// Subscribe to message types
const unsubscribe = wsService.subscribe('trade', (data) => {
  // Handle trade data
});

// Disconnect
wsService.disconnect();
```

## Best Practices

1. **Singleton Pattern**: Services are typically implemented as singletons to ensure consistent state across the application.

2. **Error Handling**: Services should handle errors gracefully and provide meaningful error messages to callers.

3. **Dependency Injection**: Services should accept dependencies through constructors or methods rather than creating them internally.

4. **Testability**: Services should be designed for testability, with clear interfaces and minimal side effects.

5. **Logging**: Services should include appropriate logging for debugging and monitoring purposes.

6. **Type Safety**: All service methods and properties should be properly typed with TypeScript.

7. **Documentation**: Complex service methods should include JSDoc comments explaining their purpose, parameters, and return values.

## Testing

Services are tested using Jest following the Test-Driven Development (TDD) approach:

1. Write failing tests first
2. Implement minimal code to pass tests
3. Refactor to ensure adherence to SOLID principles

External dependencies (APIs, WebSockets, etc.) should be mocked in tests to ensure consistent and reliable test results.
