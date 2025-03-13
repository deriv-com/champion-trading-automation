# Types

This directory contains TypeScript type definitions used throughout the Champion Trading Automation application.

## Overview

TypeScript types provide static type checking during development, improving code quality and developer experience. The types in this directory define the shape of data structures, API responses, and component props used across the application.

## Available Type Definitions

### auth.ts

Contains types related to authentication and authorization.

**Key Types:**
- `AuthParams`: Parameters used for authentication
- `AuthorizeResponse`: Response from authorization API
- `LoginRequest`: Request structure for login
- `LoginResponse`: Response structure from login API
- `TokenInfo`: Structure of authentication tokens

**Usage:**
```typescript
import { AuthorizeResponse, TokenInfo } from '../types/auth';

function handleAuth(response: AuthorizeResponse) {
  const token: TokenInfo = response.authorize;
  // Use token information
}
```

### form.ts

Contains types related to form handling and validation.

**Key Types:**
- `FormField`: Generic form field structure
- `FormValidation`: Validation rules and error messages
- `FormState`: Form state including values, errors, and dirty state

**Usage:**
```typescript
import { FormField, FormValidation } from '../types/form';

const emailField: FormField<string> = {
  value: '',
  label: 'Email',
  required: true,
  validation: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  }
};
```

### market.ts

Contains types related to trading markets and instruments.

**Key Types:**
- `Market`: Market information structure
- `MarketType`: Enum of market types (forex, crypto, stocks, etc.)
- `MarketStatus`: Market status information
- `MarketSymbol`: Trading symbol structure

**Usage:**
```typescript
import { Market, MarketType } from '../types/market';

const btcMarket: Market = {
  id: 'BTC/USD',
  name: 'Bitcoin/US Dollar',
  type: MarketType.CRYPTO,
  precision: 2,
  minAmount: 0.001,
  maxAmount: 10
};
```

### positions.ts

Contains types related to trading positions.

**Key Types:**
- `Position`: Trading position structure
- `PositionStatus`: Enum of position statuses
- `PositionType`: Enum of position types (long/short)
- `PositionFilters`: Filters for positions list

**Usage:**
```typescript
import { Position, PositionStatus, PositionType } from '../types/positions';

const position: Position = {
  id: '12345',
  symbol: 'BTC/USD',
  type: PositionType.LONG,
  amount: 0.1,
  entryPrice: 50000,
  currentPrice: 51000,
  profit: 100,
  profitPercentage: 2,
  status: PositionStatus.OPEN,
  openTime: new Date().toISOString()
};
```

### sse.ts

Contains types related to Server-Sent Events.

**Key Types:**
- `SSEEvent`: Server-sent event structure
- `SSEConnectionStatus`: Connection status enum
- `SSEOptions`: Configuration options for SSE connections

**Usage:**
```typescript
import { SSEEvent, SSEConnectionStatus } from '../types/sse';

function handleEvent(event: SSEEvent) {
  if (event.type === 'trade') {
    // Handle trade event
  }
}
```

### strategy.ts

Contains types related to trading strategies.

**Key Types:**
- `Strategy`: Trading strategy structure
- `StrategyType`: Enum of strategy types
- `StrategyParameter`: Strategy parameter structure
- `StrategyPerformance`: Strategy performance metrics

**Usage:**
```typescript
import { Strategy, StrategyType } from '../types/strategy';

const strategy: Strategy = {
  id: 'macd-cross',
  name: 'MACD Crossover',
  type: StrategyType.TECHNICAL,
  description: 'Trades based on MACD indicator crossovers',
  parameters: [
    { name: 'fastPeriod', value: 12, type: 'number' },
    { name: 'slowPeriod', value: 26, type: 'number' },
    { name: 'signalPeriod', value: 9, type: 'number' }
  ]
};
```

### trade.ts

Contains types related to trading operations.

**Key Types:**
- `Trade`: Trade operation structure
- `TradeDirection`: Enum of trade directions (buy/sell)
- `TradeStatus`: Enum of trade statuses
- `TradeResult`: Result of trade execution

**Usage:**
```typescript
import { Trade, TradeDirection, TradeStatus } from '../types/trade';

const trade: Trade = {
  id: '67890',
  symbol: 'ETH/USD',
  direction: TradeDirection.BUY,
  amount: 1.5,
  price: 3000,
  status: TradeStatus.EXECUTED,
  timestamp: new Date().toISOString()
};
```

### websocket.ts

Contains types related to WebSocket connections.

**Key Types:**
- `WSMessage`: WebSocket message structure
- `WSConnectionStatus`: Connection status enum
- `WSOptions`: Configuration options for WebSocket connections

**Usage:**
```typescript
import { WSMessage, WSConnectionStatus } from '../types/websocket';

function handleMessage(message: WSMessage) {
  if (message.type === 'price_update') {
    // Handle price update message
  }
}
```

## Type Relationships and Structure

Understanding the relationships between types helps prevent redundancy and promotes reuse. Here's how types are structured in this application:

### Type Hierarchy

```
BaseTypes
├── Common Types (ID, Timestamp, etc.)
├── Domain-Specific Base Types
│   ├── Market-Related
│   ├── Trade-Related
│   ├── Auth-Related
│   └── UI-Related
└── Utility Types (Generic wrappers, etc.)
```

### Type Composition Pattern

Many complex types are composed from simpler ones. For example:

```typescript
// Base type
interface BasePosition {
  id: string;
  symbol: string;
  amount: number;
}

// Extended type
interface Position extends BasePosition {
  type: PositionType;
  entryPrice: number;
  currentPrice: number;
  profit: number;
  profitPercentage: number;
  status: PositionStatus;
  openTime: string;
}

// Specialized type
interface HistoricalPosition extends Position {
  closeTime: string;
  closePrice: number;
  finalProfit: number;
}
```

### Type Reuse Across Domains

Types are designed to be reused across different domains when appropriate:

```typescript
// Shared type used in multiple domains
interface Timestamp {
  createdAt: string;
  updatedAt: string;
}

// Used in positions
interface Position extends BasePosition, Timestamp {
  // Position-specific properties
}

// Used in strategies
interface Strategy extends BaseStrategy, Timestamp {
  // Strategy-specific properties
}
```

## Preventing Redundant Types

To avoid creating redundant types, follow these guidelines:

### 1. Check Existing Types First

Before creating a new type, check if an existing type can be:
- Used directly
- Extended with interfaces
- Composed using intersection types
- Specialized using generics
- Transformed using utility types

### 2. Use Type Composition

Instead of creating new types with duplicated properties, compose them:

```typescript
// AVOID:
interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
}

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  permissions: string[];
}

// BETTER:
interface BaseProfile {
  id: string;
  name: string;
  email: string;
}

interface UserProfile extends BaseProfile {
  preferences: UserPreferences;
}

interface AdminProfile extends BaseProfile {
  permissions: string[];
}
```

### 3. Leverage TypeScript Utility Types

Use built-in utility types to derive new types from existing ones:

```typescript
// Original type
interface TradeSettings {
  symbol: string;
  amount: number;
  leverage: number;
  stopLoss: number;
  takeProfit: number;
}

// Derived types
type PartialTradeSettings = Partial<TradeSettings>; // All properties optional
type ReadonlyTradeSettings = Readonly<TradeSettings>; // All properties readonly
type TradeSettingsInput = Omit<TradeSettings, 'stopLoss' | 'takeProfit'>; // Exclude specific properties
type TradeSymbolAmount = Pick<TradeSettings, 'symbol' | 'amount'>; // Include only specific properties
```

### 4. Use Discriminated Unions

For related types with different shapes, use discriminated unions:

```typescript
// Instead of separate unrelated types:
interface SuccessResponse {
  success: true;
  data: any;
}

interface ErrorResponse {
  success: false;
  error: string;
  code: number;
}

// Use as a discriminated union:
type ApiResponse = SuccessResponse | ErrorResponse;

// Usage:
function handleResponse(response: ApiResponse) {
  if (response.success) {
    // TypeScript knows this is SuccessResponse
    console.log(response.data);
  } else {
    // TypeScript knows this is ErrorResponse
    console.error(response.error, response.code);
  }
}
```

## Best Practices

### Type Design Principles

1. **Consistency**: Maintain consistent naming and structure across related types.
   - Use consistent naming patterns (e.g., `BaseX`, `XInput`, `XOutput`)
   - Follow consistent property naming conventions
   - Use consistent patterns for optional vs. required properties

2. **Composability**: Use composition to build complex types from simpler ones.
   - Create small, focused types that can be combined
   - Use interface extension and type intersections
   - Prefer composition over duplication

3. **Reusability**: Design types to be reusable across different parts of the application.
   - Extract common patterns into shared types
   - Use generics for flexible, reusable type patterns
   - Document reusable types thoroughly

4. **Documentation**: Include JSDoc comments for complex types to explain their purpose and usage.
   - Document non-obvious constraints and relationships
   - Provide examples for complex types
   - Explain the purpose of each type

### TypeScript Features

1. **Interfaces vs. Types**: 
   - Use `interface` for object shapes that might be extended
   - Use `type` for unions, intersections, and simpler types
   - Be consistent with your choice for similar kinds of types

2. **Generics**: Use generics to create flexible, reusable types.
   ```typescript
   // Generic response wrapper
   interface ApiResponse<T> {
     data: T;
     status: number;
     message: string;
   }
   
   // Usage
   type UserResponse = ApiResponse<User>;
   type PositionsResponse = ApiResponse<Position[]>;
   ```

3. **Utility Types**: Leverage TypeScript's utility types to derive new types from existing ones.
   - `Partial<T>`: Make all properties optional
   - `Required<T>`: Make all properties required
   - `Readonly<T>`: Make all properties readonly
   - `Pick<T, K>`: Select specific properties
   - `Omit<T, K>`: Exclude specific properties
   - `Record<K, T>`: Create a type with properties of type K and values of type T

4. **Enums**: Use enums for values that represent a fixed set of options.
   - Consider using string enums for better debugging
   - Use const enums for performance when appropriate
   - Document each enum value

### Organizing Types

1. **Domain-Driven**: Group types by domain rather than by technical role.
   - Keep related types together in the same file
   - Name files according to their domain (e.g., `auth.ts`, `trade.ts`)
   - Consider subdirectories for complex domains

2. **Avoid Circular Dependencies**: Be careful not to create circular dependencies between type files.
   - Extract shared types to a common file
   - Use interface merging when appropriate
   - Consider using type imports vs. value imports

3. **Export All**: Export all types from their respective files to make them available for import.
   - Consider creating index files for complex type hierarchies
   - Use named exports for better import statements
   - Consider barrel exports for related types

## Creating New Types

When creating new types:

1. **Check Existing Types**: Review existing types to avoid duplication
2. **Place Appropriately**: Put them in the appropriate domain file or create a new file if needed
3. **Follow Conventions**: Adhere to established naming conventions
4. **Document Thoroughly**: Use JSDoc comments to document complex types
5. **Consider Usage**: Think about how the types will be used across the application
6. **Handle Nullability**: Ensure proper typing for null/undefined values
7. **Review with Team**: For complex or widely-used types, consider a team review

### Example: Creating a New Domain Type

```typescript
/**
 * Represents a trading bot configuration.
 * @property id - Unique identifier for the bot
 * @property name - Display name for the bot
 * @property strategy - Reference to the strategy used by this bot
 * @property market - The market this bot trades on
 * @property parameters - Custom parameters for this bot instance
 * @property status - Current operational status
 */
interface Bot {
  id: string;
  name: string;
  strategy: StrategyReference;
  market: MarketSymbol;
  parameters: BotParameter[];
  status: BotStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Reference to a strategy, can be either an ID or a complete strategy object
 */
type StrategyReference = string | Strategy;

/**
 * Custom parameter for a bot instance
 */
interface BotParameter {
  name: string;
  value: string | number | boolean;
  type: 'string' | 'number' | 'boolean';
}

/**
 * Possible operational statuses for a bot
 */
enum BotStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  PAUSED = 'paused',
  ERROR = 'error'
}
```
