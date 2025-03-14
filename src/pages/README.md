# Pages

This directory contains the top-level page components for the Champion Trading Automation application.

## Overview

Pages represent the main views of the application that are directly associated with routes. Each page component typically:

1. Composes multiple smaller components
2. Connects to relevant contexts for data and state
3. Handles page-specific logic and state
4. Manages layout for its content

## Available Pages

### BotsPage

**Purpose**: Provides a comprehensive interface for managing automated trading bots.

**Implementation Details**:
- Located at `src/pages/BotsPage.tsx`
- Implements a responsive layout for both desktop and mobile views
- Uses React hooks for local state management
- Integrates with WebSocket for real-time bot status updates
- Handles bot CRUD operations through API service calls

**Key Features**:
- List of configured trading bots with filtering and sorting options
- Bot creation wizard with step-by-step configuration
- Bot editing interface with parameter validation
- Real-time bot execution controls and status monitoring
- Performance metrics visualization with charts
- Bot duplication and template functionality

**Usage Example**:
```tsx
// Example of how BotsPage is used in the router
import { BotsPage } from '../pages';

const routes = [
  {
    path: '/bots',
    element: <BotsPage />,
  },
];

// Example of how to navigate to BotsPage
import { useNavigate } from 'react-router-dom';

function NavigationButton() {
  const navigate = useNavigate();
  
  return (
    <button onClick={() => navigate('/bots')}>
      Manage Bots
    </button>
  );
}
```

**Component Structure**:
```
BotsPage
├── PageTitle
├── BotFilters
├── Bots
│   └── BotCard (multiple)
├── CreateBotButton
└── BotDrawer (conditionally rendered)
```

**Key Components Used**:
- `Bots` component for displaying the list of bots
- `BotCard` for individual bot display
- `StrategyForm` for configuring bot strategies

**State Management**:
- Uses contexts for bot data and execution status
- Local state for UI controls (filters, sorting, selected bot)
- WebSocket integration for real-time updates

**User Flows**:
1. View all bots with status indicators
2. Filter and sort bots by various criteria
3. Create new bot with strategy selection
4. Edit existing bot parameters
5. Start/stop bot execution
6. View bot performance metrics

### ConfigEndpointPage

**Purpose**: Provides a standalone interface for configuring API endpoints and connection settings.

**Implementation Details**:
- Located at `src/pages/ConfigEndpointPage.tsx`
- Standalone page outside the main application layout
- Implements form validation and connection testing
- Persists configuration through the config service
- Handles error states and validation feedback

**Key Features**:
- API endpoint URL configuration
- Authentication credentials management
- Connection testing with status feedback
- Secure storage of sensitive information
- Environment selection (production, staging, development)

**Usage Example**:
```tsx
// Example of how ConfigEndpointPage is used in the router
import { ConfigEndpointPage } from '../pages';

const routes = [
  {
    path: '/endpoint',
    element: <ConfigEndpointPage />,
  },
];

// Example of a link to the config page
import { Link } from 'react-router-dom';

function ConfigLink() {
  return (
    <Link to="/endpoint">
      Configure API Endpoints
    </Link>
  );
}
```

**Component Structure**:
```
ConfigEndpointPage
├── Header
├── ConfigEndpoint
│   ├── InputField (multiple)
│   └── ConnectionTestButton
└── ActionButtons
```

**Key Components Used**:
- `ConfigEndpoint` component for the configuration interface
- `InputField` components for form inputs
- `Button` components for actions and testing

**State Management**:
- Uses local state for form handling
- Persists configuration through the config service
- Uses error state for validation and connection issues

**User Flows**:
1. Enter API endpoint URLs
2. Configure authentication credentials
3. Test connection to verify settings
4. Save configuration
5. Return to main application with new settings

### DiscoverPage

**Purpose**: Serves as the main landing page that showcases available trading strategies and market insights.

**Implementation Details**:
- Located at `src/pages/DiscoverPage.tsx`
- Implements a dashboard-style layout with multiple sections
- Uses data fetching hooks for strategy and market data
- Implements lazy loading for performance optimization
- Handles various loading and error states

**Key Features**:
- Featured trading strategies with performance metrics
- Market trends and insights with visual indicators
- Quick access to strategy creation and customization
- Strategy filtering and categorization
- Performance comparison tools

**Usage Example**:
```tsx
// Example of how DiscoverPage is used in the router
import { DiscoverPage } from '../pages';

const routes = [
  {
    path: '/',
    element: <DiscoverPage />,
  },
  {
    path: '/discover',
    element: <DiscoverPage />,
  },
];

// Example of accessing strategy data in the page
function DiscoverPageContent() {
  const { strategies, isLoading, error } = useStrategies();
  
  if (isLoading) return <LoadingIndicator />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      <h2>Featured Strategies</h2>
      <StrategyList strategies={strategies.filter(s => s.featured)} />
    </div>
  );
}
```

**Component Structure**:
```
DiscoverPage
├── PageTitle
├── MarketOverview
├── FeaturedStrategies
│   └── StrategyCard (multiple)
├── MarketInsights
└── StrategyFilters
```

**Key Components Used**:
- `StrategyList` for displaying available strategies
- `StrategyCard` for individual strategy display
- `MarketSelector` for filtering strategies by market
- `MarketInsights` for displaying market trends

**State Management**:
- Uses contexts for strategy data and market information
- Uses local state for UI controls (filters, selected strategy)
- Implements data fetching with caching

**User Flows**:
1. Browse featured strategies
2. Filter strategies by market or performance
3. View detailed strategy information
4. Compare strategy performance
5. Select a strategy for bot creation

### PositionsPage

**Purpose**: Provides a comprehensive interface for monitoring and managing trading positions.

**Implementation Details**:
- Located at `src/pages/PositionsPage.tsx`
- Implements real-time position tracking
- Uses WebSocket for live updates
- Provides detailed position analytics
- Handles various position states (open, closed, pending)

**Key Features**:
- Real-time list of current trading positions
- Detailed position information with entry/exit points
- Position performance metrics and P&L calculations
- Advanced filtering and sorting options
- Trade history with exportable reports
- Position modification controls

**Usage Example**:
```tsx
// Example of how PositionsPage is used in the router
import { PositionsPage } from '../pages';

const routes = [
  {
    path: '/positions',
    element: <PositionsPage />,
  },
];

// Example of position data handling
function PositionsList() {
  const { positions, filters, setFilters } = usePositions();
  const filteredPositions = applyFilters(positions, filters);
  
  return (
    <div>
      <TradeFilters filters={filters} onChange={setFilters} />
      <TradeGrid positions={filteredPositions} />
    </div>
  );
}
```

**Component Structure**:
```
PositionsPage
├── PageTitle
├── PositionsSummary
├── TradeFilters
├── Positions
│   ├── TradeGrid
│   └── TradeCard (multiple)
└── TradeHistory
```

**Key Components Used**:
- `Positions` component for the main positions display
- `TradeCard` for individual position display
- `TradeFilters` for filtering positions
- `TradeGrid` for tabular position display

**State Management**:
- Uses `PositionsContext` for position data
- Uses `TradeContext` for trade operations
- WebSocket integration for real-time updates
- Local state for UI controls (filters, sorting, selected position)

**User Flows**:
1. View all current positions with real-time updates
2. Filter and sort positions by various criteria
3. View detailed information for a specific position
4. Modify open positions (add stop loss, take profit)
5. Close positions manually
6. View historical trade performance

### SettingsPage

**Purpose**: Provides a centralized interface for managing application settings and user preferences.

**Implementation Details**:
- Located at `src/pages/SettingsPage.tsx`
- Implements a tabbed interface for different setting categories
- Handles form validation and setting persistence
- Provides immediate feedback for setting changes
- Implements user preference management

**Key Features**:
- User profile management with account information
- Application theme and display preferences
- Notification settings and alert configuration
- Security settings and authentication options
- Data export and backup functionality
- Application information and version details

**Usage Example**:
```tsx
// Example of how SettingsPage is used in the router
import { SettingsPage } from '../pages';

const routes = [
  {
    path: '/menu',
    element: <SettingsPage />,
  },
];

// Example of settings management
function ThemeSettings() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div>
      <h3>Theme Settings</h3>
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={toggleTheme}
        />
        Dark Mode
      </label>
    </div>
  );
}
```

**Component Structure**:
```
SettingsPage
├── PageTitle
├── SettingsTabs
├── ProfileSection
├── AppearanceSection
├── NotificationsSection
├── SecuritySection
└── AboutSection
```

**Key Components Used**:
- `Settings` component for the settings interface
- `InputField` components for form inputs
- `Tabs` component for navigation between setting categories
- `Switch` components for toggling options

**State Management**:
- Uses various contexts for different settings domains
- Uses local state for form handling
- Implements setting persistence through services

**User Flows**:
1. View and edit user profile information
2. Change application theme and display settings
3. Configure notification preferences
4. Manage security settings and authentication
5. View application information and version
6. Export data and create backups

## Routing

Pages are connected to routes in the `router/index.tsx` file. The main application layout in `App.tsx` provides the common structure (header, navigation) for all pages except standalone pages like `ConfigEndpointPage`.

## Best Practices

### Page Structure

1. **Component Composition**: Pages should compose smaller, reusable components rather than implementing complex UI directly.

2. **Container Pattern**: Pages often follow the container pattern, separating data fetching and state management from presentation.

3. **Lazy Loading**: Consider using React's lazy loading for pages to improve initial load performance.

### State Management

1. **Context Usage**: Use appropriate contexts for shared state, but prefer local state for page-specific concerns.

2. **Data Fetching**: Implement data fetching at the page level when the data is only needed for that page.

3. **Loading States**: Handle loading, error, and empty states gracefully.

### Performance

1. **Memoization**: Use React.memo, useMemo, and useCallback to prevent unnecessary re-renders.

2. **Code Splitting**: Implement code splitting at the page level to reduce bundle size.

3. **Virtualization**: For pages with long lists, consider virtualization to improve performance.

## Testing

Pages are tested using Jest and React Testing Library:

1. **Integration Testing**: Test pages as integration points, verifying that components work together correctly.

2. **Mock Contexts**: Mock context providers to test pages with different state scenarios.

3. **User Interactions**: Test key user flows and interactions within each page.

4. **Snapshot Testing**: Use snapshot tests to detect unintended UI changes.

## Creating New Pages

When creating a new page:

1. Create a new file in the pages directory named with the PascalCase convention (e.g., `NewFeaturePage.tsx`)
2. Export the page component as the default export
3. Add the page to the exports in `index.ts`
4. Add the route in `router/index.tsx`
5. Consider lazy loading for performance optimization
