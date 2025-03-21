/**
 * @file: router/index.tsx
 * @description: Application routing configuration using React Router,
 *               defining routes, navigation mappings, and route structure.
 *
 * @components:
 *   - routes: Array of route objects defining the application's routing structure
 *   - router: Configured browser router instance
 *   - pathToTab/tabToPath: Mapping objects for navigation state synchronization
 * @dependencies:
 *   - react-router-dom: For routing functionality
 *   - App: Main application component
 *   - pages: Page components for different routes
 * @usage:
 *   // In main.tsx
 *   import { RouterProvider } from 'react-router-dom';
 *   import { router } from './router';
 *
 *   ReactDOM.createRoot(document.getElementById('root')!).render(
 *     <RouterProvider router={router} />
 *   );
 *
 * @architecture: Centralized routing configuration with nested routes
 * @relationships:
 *   - Used by: main.tsx for router initialization
 *   - References: App component and page components
 *   - Referenced by: Navigation components for path mapping
 * @dataFlow: Defines how URL paths map to rendered components
 *
 * @ai-hints: The router uses a nested structure with App as the parent layout
 *            and child routes rendered through the Outlet component. The mapping
 *            objects (pathToTab/tabToPath) synchronize URL paths with UI state.
 */
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import App from '../App';
import { DiscoverPage, BotsPage, PositionsPage, SettingsPage, ConfigEndpointPage } from '../pages';

// Define routes
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
      {
        path: 'bots',
        element: <BotsPage />,
      },
      {
        path: 'positions',
        element: <PositionsPage />,
      },
      {
        path: 'menu',
        element: <SettingsPage />,
      },
    ],
  },
  // Separate route for config endpoint (not part of the main app layout)
  {
    path: '/endpoint',
    element: <ConfigEndpointPage />,
  },
];

// Create router
export const router = createBrowserRouter(routes);

// Map path to tab name
export const pathToTab: Record<string, string> = {
  '/': 'discover',
  '/discover': 'discover',
  '/bots': 'bots',
  '/positions': 'positions',
  '/menu': 'menu',
};

// Map tab name to path
export const tabToPath: Record<string, string> = {
  'discover': '/discover',
  'bots': '/bots',
  'positions': '/positions',
  'menu': '/menu',
};
