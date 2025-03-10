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
