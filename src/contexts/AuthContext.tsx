import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthorizeResponse } from '../types/auth';
import { authStore } from '../stores/authStore';

interface AuthContextType {
  authParams: Record<string, string> | null;
  setAuthParams: (params: Record<string, string> | null) => void;
  authorizeResponse: AuthorizeResponse | null;
  setAuthorizeResponse: (response: AuthorizeResponse | null) => void;
}

const STORAGE_KEYS = {
  APP_PARAMS: 'app_params',
  APP_AUTH: 'app_auth'
};

function getStoredValue<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return null;
  }
}

function setStoredValue<T>(key: string, value: T | null): void {
  try {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authParams, setAuthParamsState] = useState<Record<string, string> | null>(() => 
    getStoredValue(STORAGE_KEYS.APP_PARAMS)
  );
  
  const [authorizeResponse, setAuthorizeResponseState] = useState<AuthorizeResponse | null>(() => 
    getStoredValue(STORAGE_KEYS.APP_AUTH)
  );

  const setAuthParams = (params: Record<string, string> | null) => {
    setAuthParamsState(params);
    setStoredValue(STORAGE_KEYS.APP_PARAMS, params);
    authStore.setAuthParams(params);
  };

  const setAuthorizeResponse = (response: AuthorizeResponse | null) => {
    setAuthorizeResponseState(response);
    setStoredValue(STORAGE_KEYS.APP_AUTH, response);
    authStore.setAuthorizeResponse(response);
  };

  // Initialize authStore with stored data on mount
  useEffect(() => {
    const storedAuth = getStoredValue<AuthorizeResponse>(STORAGE_KEYS.APP_AUTH);
    const storedParams = getStoredValue<Record<string, string>>(STORAGE_KEYS.APP_PARAMS);
    
    if (storedAuth) {
      authStore.setAuthorizeResponse(storedAuth);
    }
    if (storedParams) {
      authStore.setAuthParams(storedParams);
    }
  }, []);

  // Clear storage on auth error
  useEffect(() => {
    if (authorizeResponse?.error) {
      setAuthParams(null);
      setAuthorizeResponse(null);
    }
  }, [authorizeResponse?.error]);

  return (
    <AuthContext.Provider 
      value={{ 
        authParams, 
        setAuthParams,
        authorizeResponse,
        setAuthorizeResponse
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
