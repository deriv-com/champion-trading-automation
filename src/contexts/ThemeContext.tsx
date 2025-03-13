import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  effectiveTheme: 'light' | 'dark'; // The actual theme applied (light/dark), considering system preference
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check if theme preference exists in localStorage
    const savedTheme = localStorage.getItem('theme');
    // Return saved theme or default to 'system'
    return (savedTheme as Theme) || 'system';
  });

  // Track system preference
  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  // Calculate the effective theme (what's actually applied)
  const effectiveTheme = theme === 'system' ? systemPreference : theme as 'light' | 'dark';

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      }
    };
  }, []);

  useEffect(() => {
    // Update localStorage when theme changes
    localStorage.setItem('theme', theme);
    
    // Update document class based on effective theme
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }, [theme, effectiveTheme]);

  const toggleTheme = () => {
    setThemeState(prevTheme => {
      if (prevTheme === 'system') return 'light';
      if (prevTheme === 'light') return 'dark';
      return 'system'; // Cycle through system -> light -> dark -> system
    });
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export { ThemeProvider, useTheme };
export default ThemeContext;
