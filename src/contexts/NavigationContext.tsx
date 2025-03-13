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
