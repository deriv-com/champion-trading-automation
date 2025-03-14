import { useEffect, useCallback, useState } from 'react';
import { sseService } from '../services/sse/sseService';
import { ExternalAPIHeaders } from '../types/balance';

interface UseExternalSSEOptions<T> {
  url: string;
  headers?: ExternalAPIHeaders; // Optional headers for external APIs
  onMessage?: (data: T) => void;
  onError?: (error: Event) => void;
  onOpen?: (event: Event) => void;
  autoConnect?: boolean;
  withCredentials?: boolean;
}

/**
 * useExternalSSE: Hook for connecting to external SSE endpoints that don't require authentication
 * @param options Configuration options for the SSE connection
 * @returns Connection state and control methods
 */
export function useExternalSSE<T = any>(
  options: UseExternalSSEOptions<T>
) {
  const [isConnected, setIsConnected] = useState(false);
  const {
    url,
    headers = {}, // Default to empty headers
    onMessage,
    onError,
    onOpen,
    autoConnect = true,
    withCredentials = false // Default to false for external APIs
  } = options;

  const handleMessage = useCallback((event: MessageEvent) => {
    if (onMessage) {
      try {
        // Ensure we have a string to parse
        if (typeof event.data !== 'string') {
          console.error('ExternalSSE: Expected string data but got:', typeof event.data);
          return;
        }
        
        // Parse the JSON data
        const data = JSON.parse(event.data);
        
        // Validate the data structure
        if (!data) {
          console.error('ExternalSSE: Parsed data is null or undefined');
          return;
        }
        
        // Pass the parsed data to the onMessage callback
        onMessage(data);
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    }
  }, [onMessage]);

  const connect = useCallback(() => {
    // Convert ExternalAPIHeaders to Record<string, string> for sseService
    const headerRecord: Record<string, string> = { ...headers };
    
    sseService.connect({
      url,
      // @ts-ignore - We're bypassing the SSEHeaders type check
      headers: headerRecord,
      withCredentials,
      onMessage: handleMessage,
      onError,
      onOpen
    });
  }, [url, headers, withCredentials, handleMessage, onError, onOpen]);

  const disconnect = useCallback(() => {
    sseService.disconnect();
  }, []);

  // Handle auto-connect and cleanup
  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    return () => {
      if (autoConnect) {
        disconnect();
      }
    };
  }, [autoConnect, connect, disconnect]);

  // Track connection status
  useEffect(() => {
    const checkConnection = setInterval(() => {
      const connected = sseService.isConnected();
      setIsConnected(connected);
    }, 1000);

    return () => {
      clearInterval(checkConnection);
    };
  }, []);

  return {
    isConnected,
    connect,
    disconnect
  };
}