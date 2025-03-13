# Stores

This directory contains store modules that manage application state outside of React's component tree.

## Overview

Stores in this application provide a way to manage state that needs to be accessed by multiple components or persisted across sessions. They work alongside React Context to provide a complete state management solution.

## Store vs. Context

In this application:

- **Stores** handle state persistence, business logic, and data transformations
- **Contexts** provide React components with access to state and actions

This separation of concerns allows for better testability and maintainability.

## Available Stores

### authStore

Manages authentication state and tokens.

**Key Features:**
- Stores authentication parameters and tokens
- Provides methods for setting and retrieving auth data
- Handles token expiration and refresh
- Generates authentication headers for API requests

**Usage:**
```typescript
import { authStore } from '../stores/authStore';

// Get authentication headers
const headers = authStore.getHeaders();

// Set authentication parameters
authStore.setAuthParams({
  token1: 'access-token',
  token2: 'refresh-token'
});

// Set authorization response
authStore.setAuthorizeResponse({
  msg_type: 'authorize',
  authorize: {
    // Token information
  }
});

// Check if user is authenticated
const isAuthenticated = authStore.isAuthenticated();
```

## Implementation Pattern

Stores follow a simple module pattern with private state and public methods:

```typescript
// Example store pattern
class ExampleStore {
  private state = {
    data: null,
    isLoading: false,
    error: null
  };

  // Getters
  getData() {
    return this.state.data;
  }

  isLoading() {
    return this.state.isLoading;
  }

  getError() {
    return this.state.error;
  }

  // Setters and actions
  setData(data: any) {
    this.state.data = data;
    this.notifyListeners();
  }

  setLoading(isLoading: boolean) {
    this.state.isLoading = isLoading;
    this.notifyListeners();
  }

  setError(error: Error | null) {
    this.state.error = error;
    this.notifyListeners();
  }

  // Async actions
  async fetchData() {
    try {
      this.setLoading(true);
      this.setError(null);
      
      const response = await apiService.get('/data');
      this.setData(response.data);
      
      return response.data;
    } catch (error) {
      this.setError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  // Observer pattern for reactivity
  private listeners: Function[] = [];

  subscribe(listener: Function) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

// Export as singleton
export const exampleStore = new ExampleStore();
```

## Integration with React Context

Stores are typically integrated with React Context to provide state to components:

```typescript
// Context definition
import { createContext, useContext, useState, useEffect } from 'react';
import { exampleStore } from '../stores/exampleStore';

const ExampleContext = createContext(null);

export function ExampleProvider({ children }) {
  const [state, setState] = useState(exampleStore.getState());

  useEffect(() => {
    // Subscribe to store changes
    const unsubscribe = exampleStore.subscribe(newState => {
      setState(newState);
    });
    
    return unsubscribe;
  }, []);

  // Provide store methods along with state
  const value = {
    ...state,
    fetchData: exampleStore.fetchData.bind(exampleStore)
  };

  return (
    <ExampleContext.Provider value={value}>
      {children}
    </ExampleContext.Provider>
  );
}

export function useExample() {
  const context = useContext(ExampleContext);
  if (!context) {
    throw new Error('useExample must be used within an ExampleProvider');
  }
  return context;
}
```

## Persistence

Some stores implement persistence to maintain state across page reloads:

```typescript
// Example of persistence implementation
class PersistentStore {
  private state = this.loadState();

  private loadState() {
    try {
      const savedState = localStorage.getItem('store-key');
      return savedState ? JSON.parse(savedState) : { /* default state */ };
    } catch (error) {
      console.error('Failed to load state:', error);
      return { /* default state */ };
    }
  }

  private saveState() {
    try {
      localStorage.setItem('store-key', JSON.stringify(this.state));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.saveState();
    this.notifyListeners();
  }

  // Rest of the store implementation...
}
```

## Best Practices

### Store Design

1. **Single Responsibility**: Each store should focus on a specific domain of the application.

2. **Immutability**: Treat state as immutable and create new state objects when updating.

3. **Encapsulation**: Keep state private and expose it only through getters and actions.

### Performance

1. **Selective Updates**: Notify listeners only when relevant parts of the state change.

2. **Batched Updates**: Batch multiple state changes to avoid excessive re-renders.

3. **Memoization**: Use memoization techniques to avoid unnecessary computations.

### Testing

1. **Unit Testing**: Test store methods and actions in isolation.

2. **Mock Dependencies**: Mock external dependencies like API services.

3. **State Transitions**: Test that state transitions correctly based on actions.

## Creating New Stores

When creating a new store:

1. Define the store's state interface
2. Implement getters for accessing state
3. Implement setters and actions for modifying state
4. Add persistence if needed
5. Implement the observer pattern for reactivity
6. Create a corresponding React Context for component integration
