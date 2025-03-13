# Providers

This directory contains provider components that wrap the application with various contexts and services.

## Overview

Providers in React are components that use the Context API to make values available to components throughout the component tree. The providers in this directory compose multiple context providers to create a complete application state management solution.

## Structure

The main provider component is `AppProviders.tsx`, which composes all the individual context providers into a single wrapper component.

## AppProviders

The `AppProviders` component wraps the entire application with all necessary context providers:

```tsx
// AppProviders.tsx
import { ReactNode } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { NavigationProvider } from '../contexts/NavigationContext';
import { PositionsProvider } from '../contexts/PositionsContext';
import { ProcessingStackProvider } from '../contexts/ProcessingStackContext';
import { SSEProvider } from '../contexts/SSEContext';
import { TradeProvider } from '../contexts/TradeContext';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationProvider>
          <PositionsProvider>
            <ProcessingStackProvider>
              <SSEProvider>
                <TradeProvider>
                  {children}
                </TradeProvider>
              </SSEProvider>
            </ProcessingStackProvider>
          </PositionsProvider>
        </NavigationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
```

## Provider Order

The order of providers is important as it determines the dependency hierarchy:

1. **AuthProvider**: Provides authentication state and methods, which many other providers depend on
2. **ThemeProvider**: Provides theme state and methods for theme switching
3. **NavigationProvider**: Provides navigation state and methods
4. **PositionsProvider**: Provides trading positions data and methods
5. **ProcessingStackProvider**: Provides processing state management
6. **SSEProvider**: Provides Server-Sent Events connection and data
7. **TradeProvider**: Provides trading functionality and state

## Detailed Provider Descriptions

### AuthProvider

**Purpose**: Manages authentication state throughout the application.

**Implementation Details**:
- Wraps the `AuthContext` from `../contexts/AuthContext`
- Stores authentication tokens and user information
- Persists authentication state in localStorage
- Provides methods for login, logout, and token management
- Handles authentication errors and token expiration

**Key Features**:
- Automatic token refresh
- Secure token storage
- Authentication state persistence
- Integration with the `authStore` for state management outside React

**Usage Example**:
```tsx
import { useAuth } from '../contexts/AuthContext';

function ProfileComponent() {
  const { authParams, authorizeResponse, setAuthParams } = useAuth();
  
  const isLoggedIn = !!authParams?.token1;
  const username = authorizeResponse?.authorize?.email || 'Guest';
  
  const handleLogout = () => {
    setAuthParams(null);
  };
  
  return (
    <div>
      <p>Welcome, {username}</p>
      {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
    </div>
  );
}
```

### ThemeProvider

**Purpose**: Manages application theme settings (light/dark mode).

**Implementation Details**:
- Wraps the `ThemeContext` from `../contexts/ThemeContext`
- Stores current theme preference
- Persists theme preference in localStorage
- Applies theme-specific CSS variables to the document

**Key Features**:
- Theme switching between light and dark modes
- Theme persistence across sessions
- Automatic theme detection based on system preferences
- CSS variable management for consistent theming

**Usage Example**:
```tsx
import { useTheme } from '../contexts/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
    </div>
  );
}
```

### NavigationProvider

**Purpose**: Manages navigation state and active tab selection.

**Implementation Details**:
- Wraps the `NavigationContext` from `../contexts/NavigationContext`
- Tracks the currently active tab/route
- Synchronizes with router state
- Provides methods for changing the active tab

**Key Features**:
- Tab state management
- Integration with React Router
- Navigation history tracking
- Mobile-friendly navigation state

**Usage Example**:
```tsx
import { useNavigation } from '../contexts/NavigationContext';
import { tabToPath } from '../router';
import { useNavigate } from 'react-router-dom';

function NavigationTabs() {
  const { activeTab, setActiveTab } = useNavigation();
  const navigate = useNavigate();
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(tabToPath[tab]);
  };
  
  return (
    <div className="tabs">
      <button 
        className={activeTab === 'discover' ? 'active' : ''} 
        onClick={() => handleTabChange('discover')}
      >
        Discover
      </button>
      <button 
        className={activeTab === 'bots' ? 'active' : ''} 
        onClick={() => handleTabChange('bots')}
      >
        Bots
      </button>
      {/* Other tabs */}
    </div>
  );
}
```

### PositionsProvider

**Purpose**: Manages trading positions data and state.

**Implementation Details**:
- Wraps the `PositionsContext` from `../contexts/PositionsContext`
- Stores current trading positions
- Provides filtering and sorting capabilities
- Handles position updates and notifications
- Fetches position data from the API

**Key Features**:
- Real-time position updates
- Position filtering and sorting
- Position history tracking
- Performance metrics calculation

**Usage Example**:
```tsx
import { usePositions } from '../contexts/PositionsContext';

function PositionsSummary() {
  const { positions, filters, setFilters, isLoading } = usePositions();
  
  const totalProfit = positions.reduce((sum, pos) => sum + pos.profit, 0);
  
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };
  
  if (isLoading) return <div>Loading positions...</div>;
  
  return (
    <div>
      <p>Total positions: {positions.length}</p>
      <p>Total profit: {totalProfit.toFixed(2)}</p>
      <button onClick={() => handleFilterChange({ status: 'open' })}>
        Show open positions
      </button>
    </div>
  );
}
```

### ProcessingStackProvider

**Purpose**: Manages processing states, loading indicators, and notifications.

**Implementation Details**:
- Wraps the `ProcessingStackContext` from `../contexts/ProcessingStackContext`
- Tracks ongoing processes and their states
- Provides methods for adding, updating, and removing processes
- Handles success and error notifications

**Key Features**:
- Centralized loading state management
- Process queue management
- Toast notifications for process completion/failure
- Process timeout handling

**Usage Example**:
```tsx
import { useProcessingStack } from '../contexts/ProcessingStackContext';

function DataFetchingComponent() {
  const { addProcess, removeProcess, isProcessing } = useProcessingStack();
  
  const fetchData = async () => {
    const processId = addProcess({ 
      type: 'data-fetch', 
      message: 'Fetching data...' 
    });
    
    try {
      const result = await apiService.getData();
      removeProcess(processId, { 
        success: true, 
        message: 'Data fetched successfully' 
      });
      return result;
    } catch (error) {
      removeProcess(processId, { 
        success: false, 
        message: 'Failed to fetch data', 
        error 
      });
      throw error;
    }
  };
  
  return (
    <div>
      <button 
        onClick={fetchData} 
        disabled={isProcessing('data-fetch')}
      >
        {isProcessing('data-fetch') ? 'Loading...' : 'Fetch Data'}
      </button>
    </div>
  );
}
```

### SSEProvider

**Purpose**: Manages Server-Sent Events (SSE) connections and data.

**Implementation Details**:
- Wraps the `SSEContext` from `../contexts/SSEContext`
- Establishes and maintains SSE connections
- Handles reconnection logic
- Provides event data to components
- Manages connection state

**Key Features**:
- Automatic connection management
- Event filtering and distribution
- Connection state tracking
- Reconnection with exponential backoff

**Usage Example**:
```tsx
import { useSSEContext } from '../contexts/SSEContext';

function LiveUpdates() {
  const { events, connectionStatus, connect, disconnect } = useSSEContext();
  
  // Filter for specific event types
  const tradeEvents = events.filter(event => event.type === 'trade');
  
  return (
    <div>
      <p>Connection status: {connectionStatus}</p>
      <button onClick={() => connect('/api/events')}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
      
      <h3>Recent Trade Events</h3>
      <ul>
        {tradeEvents.map((event, index) => (
          <li key={index}>
            {event.data.symbol}: {event.data.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### TradeProvider

**Purpose**: Manages trading operations and state.

**Implementation Details**:
- Wraps the `TradeContext` from `../contexts/TradeContext`
- Handles trade execution and management
- Stores current trade parameters
- Provides methods for creating and modifying trades
- Integrates with the trading API

**Key Features**:
- Trade execution
- Trade parameter validation
- Trade history tracking
- Real-time trade updates

**Usage Example**:
```tsx
import { useTrade } from '../contexts/TradeContext';

function TradeForm() {
  const { executeTrade, isExecuting, lastTradeResult } = useTrade();
  const [amount, setAmount] = useState(1.0);
  const [symbol, setSymbol] = useState('BTC/USD');
  
  const handleTrade = async (direction) => {
    try {
      await executeTrade({
        symbol,
        amount,
        direction
      });
    } catch (error) {
      console.error('Trade execution failed:', error);
    }
  };
  
  return (
    <div>
      <input 
        type="number" 
        value={amount} 
        onChange={(e) => setAmount(parseFloat(e.target.value))} 
      />
      <select 
        value={symbol} 
        onChange={(e) => setSymbol(e.target.value)}
      >
        <option value="BTC/USD">BTC/USD</option>
        <option value="ETH/USD">ETH/USD</option>
      </select>
      
      <button 
        onClick={() => handleTrade('buy')} 
        disabled={isExecuting}
      >
        Buy
      </button>
      <button 
        onClick={() => handleTrade('sell')} 
        disabled={isExecuting}
      >
        Sell
      </button>
      
      {lastTradeResult && (
        <div>
          <p>Trade ID: {lastTradeResult.id}</p>
          <p>Status: {lastTradeResult.status}</p>
        </div>
      )}
    </div>
  );
}
```

## Usage

The `AppProviders` component is used in the application's entry point:

```tsx
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';
import { router } from './router';
import './styles/index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </React.StrictMode>,
);
```

## Provider Composition

Providers are composed to create a hierarchy of contexts. This allows for:

1. **Dependency Management**: Providers that depend on other contexts can access them
2. **Separation of Concerns**: Each provider focuses on a specific domain
3. **Testability**: Components can be tested with specific provider configurations

## Testing

When testing components that use contexts, you can create test-specific providers:

```tsx
// Example test setup
import { render } from '@testing-library/react';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ComponentToTest } from './ComponentToTest';

function renderWithProviders(ui, options = {}) {
  return render(
    <AuthProvider>
      <ThemeProvider>
        {ui}
      </ThemeProvider>
    </AuthProvider>,
    options
  );
}

test('Component renders correctly', () => {
  const { getByText } = renderWithProviders(<ComponentToTest />);
  expect(getByText('Expected Text')).toBeInTheDocument();
});
```

## Best Practices

### Provider Design

1. **Minimal Dependencies**: Keep provider dependencies minimal to avoid circular dependencies.

2. **Clear Responsibility**: Each provider should have a clear and focused responsibility.

3. **Performance Optimization**: Use memoization and context splitting to prevent unnecessary re-renders.

### Context Composition

1. **Logical Grouping**: Group related state and methods in the same context.

2. **Provider Order**: Arrange providers in order of dependency, with the most fundamental providers at the top.

3. **Selective Consumption**: Components should only consume the contexts they need.

### Error Handling

1. **Error Boundaries**: Wrap providers with error boundaries to catch and handle errors gracefully.

2. **Fallback Values**: Provide sensible fallback values for contexts when providers fail.

3. **Error Reporting**: Include error reporting mechanisms in providers.

## Creating New Providers

When creating a new provider:

1. Create a new context file in the `contexts` directory
2. Implement the provider component and custom hook
3. Add the provider to `AppProviders.tsx` in the appropriate position in the hierarchy
4. Consider the provider's dependencies and ensure they are available in the hierarchy
