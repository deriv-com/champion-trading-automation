/**
 * @file: main.tsx
 * @description: Application entry point that initializes the React application,
 *               sets up providers, and renders the root component.
 *
 * @components: Root application rendering setup
 * @dependencies:
 *   - React/ReactDOM: Core React libraries
 *   - react-router-dom: RouterProvider for routing
 *   - AppProviders: Combined context providers
 *   - router: Application routing configuration
 *   - styles: Global and index styles
 * @usage: This file is the entry point for the application and is not imported elsewhere
 *
 * @architecture: Standard React application entry point
 * @relationships:
 *   - Imports: AppProviders, router configuration
 *   - Renders: The entire application tree
 * @dataFlow: Initializes the application and sets up the provider hierarchy
 *
 * @ai-hints: This is the application's entry point where the React tree is mounted
 *            to the DOM. It wraps the application in StrictMode for development
 *            checks and sets up the provider hierarchy.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';
import { router } from './router';
import './styles/index.scss';
import './styles/global.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </React.StrictMode>,
);
