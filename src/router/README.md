# Router

This directory contains the routing configuration for the Champion Trading Automation application.

## Overview

The application uses React Router v6 for client-side routing. The router configuration defines the available routes, their associated components, and the routing structure of the application.

## Structure

The main router configuration is defined in `index.tsx`, which exports:

- `routes`: An array of route objects defining the application's route structure
- `router`: The configured browser router instance
- `pathToTab`: A mapping from URL paths to tab names for navigation
- `tabToPath`: A mapping from tab names to URL paths for navigation

## Route Configuration

The application uses a nested route structure:

```
/                       # Root route (App component)
├── /                   # Default route (DiscoverPage)
├── /discover           # Discover page
├── /bots               # Bots management page
├── /positions          # Trading positions page
├── /menu               # Settings page
└── /endpoint           # Config endpoint page (standalone)
```

## Implementation Details

### Route Definitions

Routes are defined using the `RouteObject` type from React Router:

```typescript
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <DiscoverPage />,
      },
      {
        path: 'discover',
        element: <DiscoverPage />,
      },
      // Other routes...
    ],
  },
  // Standalone routes...
];
```

### Browser Router

The application uses `createBrowserRouter` to create the router instance:

```typescript
export const router = createBrowserRouter(routes);
```

### Path Mappings

To facilitate navigation between tabs and routes, the router exports mappings between paths and tab names:

```typescript
export const pathToTab: Record<string, string> = {
  '/': 'discover',
  '/discover': 'discover',
  '/bots': 'bots',
  '/positions': 'positions',
  '/menu': 'menu',
};

export const tabToPath: Record<string, string> = {
  'discover': '/discover',
  'bots': '/bots',
  'positions': '/positions',
  'menu': '/menu',
};
```

## Usage

### In Components

Components can use React Router hooks for navigation and route information:

```typescript
import { useNavigate, useLocation, useParams } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  // Navigate programmatically
  const handleClick = () => {
    navigate('/bots');
  };
  
  return (
    <div>
      <p>Current path: {location.pathname}</p>
      <button onClick={handleClick}>Go to Bots</button>
    </div>
  );
}
```

### With Navigation Context

The application uses a `NavigationContext` that integrates with the router:

```typescript
import { useNavigation } from '../contexts/NavigationContext';
import { tabToPath } from '../router';

function MyComponent() {
  const { activeTab, setActiveTab } = useNavigation();
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(tabToPath[tab]);
  };
  
  return (
    <div>
      <p>Active tab: {activeTab}</p>
      <button onClick={() => handleTabChange('bots')}>Go to Bots</button>
    </div>
  );
}
```

## Route Guards and Authentication

The application implements route guards for protected routes through the `App` component, which checks authentication status and redirects unauthenticated users as needed.

## Lazy Loading

For performance optimization, page components can be lazy-loaded using React's `lazy` and `Suspense`:

```typescript
import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

const DiscoverPage = lazy(() => import('../pages/DiscoverPage'));
const BotsPage = lazy(() => import('../pages/BotsPage'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <DiscoverPage />
          </Suspense>
        ),
      },
      // Other routes...
    ],
  },
];
```

## Best Practices

1. **Route Organization**: Keep route definitions organized and grouped logically.

2. **Type Safety**: Use TypeScript to ensure type safety in route parameters and navigation.

3. **Consistent Naming**: Maintain consistent naming conventions for routes and their associated components.

4. **Route Parameters**: Use route parameters for dynamic content rather than query parameters when appropriate.

5. **Error Handling**: Implement error boundaries and 404 handling for routes.

## Testing

Routes are tested using React Testing Library and the `MemoryRouter` from React Router:

1. **Navigation Testing**: Test that navigation between routes works correctly.

2. **Route Guard Testing**: Test that protected routes redirect unauthenticated users.

3. **Route Parameter Testing**: Test that routes with parameters correctly display the appropriate content.

## Extending the Router

When adding new routes:

1. Add the route definition to the `routes` array in `index.tsx`
2. Update `pathToTab` and `tabToPath` if the route is associated with a navigation tab
3. Create the corresponding page component in the `pages` directory
4. Consider implementing lazy loading for performance optimization
