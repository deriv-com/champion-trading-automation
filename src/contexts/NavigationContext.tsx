/**
 * @file: NavigationContext.tsx
 * @description: React context provider for managing navigation state,
 *               including active tab tracking and tab switching functionality.
 *
 * @components:
 *   - NavigationContext: React context for navigation state
 *   - NavigationProvider: Provider component that manages navigation state
 *   - useNavigation: Custom hook for consuming navigation context
 *   - NavigationTab: Type definition for valid navigation tabs
 * @dependencies:
 *   - React: createContext, useContext, useState
 * @usage:
 *   // Wrap components that need navigation state
 *   <NavigationProvider>
 *     <App />
 *   </NavigationProvider>
 *
 *   // Use navigation state in components
 *   const { activeTab, setActiveTab } = useNavigation();
 *   console.log(`Current tab: ${activeTab}`);
 *
 *   // Switch to a different tab
 *   setActiveTab('positions');
 *
 * @architecture: Context Provider pattern with simple state management
 * @relationships:
 *   - Used by: Navigation component, App component
 *   - Related to: Router for URL-based navigation
 * @dataFlow:
 *   - State: Tracks the currently active navigation tab
 *   - Updates: Tab changes through setActiveTab function
 *   - Consumption: Components read activeTab to determine UI state
 *
 * @ai-hints: This context provides a centralized way to manage navigation state
 *            across the application. It uses a type-safe approach with the
 *            NavigationTab type to ensure only valid tabs can be selected.
 */
import { createContext, useContext, useState, ReactNode } from 'react';

export type NavigationTab = 'discover' | 'bots' | 'positions' | 'menu';

interface NavigationContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

/**
 * NavigationProvider: Provides navigation state management for the application.
 * Inputs: { children: ReactNode } - Child components to be wrapped with the context
 * Output: JSX.Element - Context provider with navigation state
 */
export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<NavigationTab>('discover');

  return (
    <NavigationContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </NavigationContext.Provider>
  );
}

/**
 * useNavigation: Hook to access navigation context values and methods.
 * Inputs: None
 * Output: NavigationContextType - Object with activeTab and setActiveTab
 * Throws: Error if used outside of NavigationProvider
 */
export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
