/**
 * @file: AppProviders.tsx
 * @description: Centralized provider composition that establishes the context hierarchy
 *               for the entire application, managing theme, auth, data, and UI state.
 *
 * @components:
 *   - AppProviders: Main provider composition component
 *   - ThemeConfigProvider: Ant Design theme configuration wrapper
 * @dependencies:
 *   - React: ReactNode type
 *   - antd: ConfigProvider and theme utilities
 *   - Multiple context providers: Auth, Theme, SSE, Navigation, etc.
 * @usage:
 *   // In main.tsx
 *   <AppProviders>
 *     <RouterProvider router={router} />
 *   </AppProviders>
 *
 * @architecture: Nested provider pattern with specific provider order
 * @relationships:
 *   - Used by: main.tsx as a wrapper for the entire application
 *   - Composes: Multiple context providers in a specific hierarchy
 * @dataFlow: Establishes context hierarchy where inner providers can access
 *            data from outer providers (e.g., TradeProvider can access AuthProvider)
 *
 * @ai-hints: The order of providers is important - providers that depend on other
 *            contexts must be nested inside those providers. For example, BalanceProvider
 *            is nested inside SSEProvider because it may use SSE functionality.
 */
import { ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { SSEProvider } from '../contexts/SSEContext';
import { NavigationProvider } from '../contexts/NavigationContext';
import { ProcessingStackProvider } from '../contexts/ProcessingStackContext';
import { TradeProvider } from '../contexts/TradeContext';
import { PositionsProvider } from '../contexts/PositionsContext';
import { BalanceProvider } from '../contexts/BalanceContext';

interface AppProvidersProps {
  children: ReactNode;
}

function ThemeConfigProvider({ children }: { children: ReactNode }) {
  const { theme: currentTheme } = useTheme();
  
  const antdTheme = {
    algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#00d0ff',
      borderRadius: 4,
    },
  };

  return (
    <ConfigProvider theme={antdTheme}>
      {children}
    </ConfigProvider>
  );
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <SSEProvider>
        <BalanceProvider>
          <ThemeProvider>
          <ThemeConfigProvider>
            <NavigationProvider>
              <PositionsProvider>
                <ProcessingStackProvider>
                  <TradeProvider>
                    {children}
                  </TradeProvider>
                </ProcessingStackProvider>
              </PositionsProvider>
            </NavigationProvider>
          </ThemeConfigProvider>
          </ThemeProvider>
        </BalanceProvider>
      </SSEProvider>
    </AuthProvider>
  );
}
