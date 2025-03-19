import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { sseService } from '../services/sse/sseService';
import { SSEMessage, SSE_HEADER_KEYS } from '../types/sse';

interface SSEContextType {
  isConnected: boolean;
  lastMessage: SSEMessage<unknown> | null;
  connectionTime: Date | null;
  error: string | null;
}

const SSEContext = createContext<SSEContextType | undefined>(undefined);

export function SSEProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<SSEMessage<unknown> | null>(null);
  const [connectionTime, setConnectionTime] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const connectionRef = useRef<boolean>(false);

  // No longer need auth context since we want SSE to work without authentication
  const championToken = import.meta.env.VITE_CHAMPION_TOKEN || '';
  const championApiUrl = 'http://mobile-backend-service-mock-gray:3000/';

  useEffect(() => {
    const canConnect = !connectionRef.current && championApiUrl;

    if (!canConnect) {
      console.log('SSE Context: Cannot connect, missing required parameters');
      return;
    }

    console.log('SSE Context: Starting new connection...');
    connectionRef.current = true;

    // Get the account UUID from environment variables
    const accountUuid = import.meta.env.VITE_ACCOUNT_UUID || '';

    // Prepare headers
    const headers: Record<string, string> = {
      [SSE_HEADER_KEYS.CHAMPION_URL]: championApiUrl, // Now using lowercase 'champion-url'
      [SSE_HEADER_KEYS.ACCEPT]: 'text/event-stream',
      [SSE_HEADER_KEYS.CACHE_CONTROL]: 'no-cache',
      [SSE_HEADER_KEYS.CONNECTION]: 'keep-alive'
    };
    
    // Only add Authorization header if token is available
    if (championToken) {
      headers[SSE_HEADER_KEYS.AUTHORIZATION] = `Bearer ${championToken}`;
    }

    const handlers = sseService.connect({
      url: `https://champion.mobile-bot.deriv.dev/champion/v1/sse?account_uuid=${accountUuid}`,
      headers,
      onMessage: (event) => {
        if (!connectionRef.current) return;

        try {
          console.log('SSE Context: Raw message received:', event.data);
          const data = JSON.parse(event.data);

          if (data.type === 'heartbeat') {
            console.log('SSE Context: Heartbeat received');
            if (!isConnected) {
              console.log('SSE Context: Setting connected state');
              setIsConnected(true);
              setConnectionTime(new Date());
            }
            return;
          }

          console.log('SSE Context: Message received:', data);
          setLastMessage(data);
          setError(null);
          
          if (!isConnected) {
            setIsConnected(true);
            setConnectionTime(new Date());
          }
        } catch (error) {
          console.error('SSE Context: Failed to process message:', error);
          setError('Failed to process message');
        }
      },
      withCredentials: false
    });

    console.log('SSE Context: Connection initialized with', handlers, 'handlers');

    // Cleanup function
    return () => {
      if (connectionRef.current) {
        console.log('SSE Context: Starting cleanup...');
        connectionRef.current = false;
        
        // Don't disconnect if there might be other components using the connection
        setIsConnected(false);
        setConnectionTime(null);
        console.log('SSE Context: Cleanup complete');
      }
    };
  }, [championApiUrl]); // Only depend on API URL, not authentication

  const value = {
    isConnected,
    lastMessage,
    connectionTime,
    error
  };

  return (
    <SSEContext.Provider value={value}>
      {children}
    </SSEContext.Provider>
  );
}

export function useSSEContext() {
  const context = useContext(SSEContext);
  if (context === undefined) {
    throw new Error('useSSEContext must be used within a SSEProvider');
  }
  return context;
}
