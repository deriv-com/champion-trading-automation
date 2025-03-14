# Contexts

This directory contains React Context providers used for state management throughout the Champion Trading Automation application.

## Overview

React Context is used for sharing state that is considered "global" for a tree of React components. In this application, contexts are used to manage shared state such as authentication, navigation, positions, and theme settings.

## Structure

Each context follows a similar pattern:

- Context creation with `createContext`
- Provider component that manages state and provides values to consumers
- Custom hook for consuming the context (e.g., `useAuth`, `useNavigation`)
- TypeScript interfaces for type safety

## Available Contexts

### AuthContext

Manages authentication state throughout the application.

**Key Features:**
- Stores and provides access to authentication parameters and tokens
- Handles token storage and retrieval from localStorage
- Provides methods for setting and clearing authentication data
- Integrates with authStore for persistent storage
- Automatically clears authentication on errors

**Usage:**
```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { authParams, setAuthParams, authorizeResponse } = useAuth();
  
  // Use auth state and methods
}
```

### NavigationContext

Manages navigation state and active tab selection.

**Key Features:**
- Tracks the currently active tab/route
- Provides methods for changing the active tab
- Synchronizes with router state

**Usage:**
```tsx
import { useNavigation } from '../contexts/NavigationContext';

function MyComponent() {
  const { activeTab, setActiveTab } = useNavigation();
  
  // Use navigation state and methods
}
```

### NotificationContext

Provides global notification functionality throughout the application.

**Key Features:**
- Shows notifications with customizable message and description
- Supports different notification types: success, info, warning, error
- Allows customizing notification placement (default: bottom)
- Centralizes notification management for consistent user experience

**Usage:**
```tsx
import { useNotification } from '../contexts/NotificationContext';

function MyComponent() {
  const { showNotification } = useNotification();
  
  // Show a notification with default settings (info type, bottom position)
  showNotification('Operation Successful', 'Your action has been completed.');
  
  // Show a warning notification
  showNotification('Warning', 'This action cannot be undone.', 'warning');
  
  // Show an error notification with custom position
  showNotification('Error Occurred', 'Failed to save changes.', 'error', 'topRight');
}
```

### PositionsContext

Manages trading positions data and state.

**Key Features:**
- Stores current trading positions
- Provides filtering and sorting capabilities
- Handles position updates and notifications

**Usage:**
```tsx
import { usePositions } from '../contexts/PositionsContext';

function MyComponent() {
  const { positions, filters, setFilters } = usePositions();
  
  // Use positions data and methods
}
```

### SSEContext

Manages Server-Sent Events (SSE) connections and data.

**Key Features:**
- Establishes and maintains SSE connections
- Handles reconnection logic
- Provides event data to components
- Manages connection state

**Usage:**
```tsx
import { useSSEContext } from '../contexts/SSEContext';

function MyComponent() {
  const { events, connectionStatus } = useSSEContext();
  
  // Use SSE data and connection status
}
```

### ThemeContext

Manages application theme settings.

**Key Features:**
- Provides theme switching capabilities (light/dark mode)
- Stores user theme preferences
- Applies theme-specific styles

**Usage:**
```tsx
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  // Use theme state and methods
}
```

### TradeContext

Manages trading operations and state.

**Key Features:**
- Handles trade execution and management
- Stores current trade parameters
- Provides methods for creating and modifying trades

**Usage:**
```tsx
import { useTrade } from '../contexts/TradeContext';

function MyComponent() {
  const { executeTrade, currentTrade, tradeHistory } = useTrade();
  
  // Use trade methods and data
}
```

## Best Practices

1. **Context Composition**: Use multiple smaller contexts instead of one large context to prevent unnecessary re-renders.

2. **Performance Optimization**: Implement memoization techniques like `useMemo` and `useCallback` to prevent unnecessary re-renders.

3. **Type Safety**: Define proper TypeScript interfaces for context values and provider props.

4. **Error Handling**: Implement error boundaries around context consumers to catch and handle errors gracefully.

5. **Testing**: Mock contexts in tests to isolate components and test their behavior with different context states.

## Integration with Stores

Some contexts integrate with stores (e.g., `authStore`) for persistent storage. The relationship is typically:

- Contexts provide the React interface for components
- Stores handle persistence and business logic
- Contexts sync with stores to ensure consistency
