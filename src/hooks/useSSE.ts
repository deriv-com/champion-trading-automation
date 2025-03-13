import { useEffect, useCallback, useState } from 'react';
import { sseService } from '../services/sse/sseService';
import { SSEHeaders } from '../types/sse';

interface UseSSEOptions<T> {
  url: string;
  headers: SSEHeaders;
  onMessage?: (data: T) => void;
  onError?: (error: Event) => void;
  onOpen?: (event: Event) => void;
  autoConnect?: boolean;
  withCredentials?: boolean;
}

export function useSSE<T = any>(
  options: UseSSEOptions<T>
) {
  const [isConnected, setIsConnected] = useState(false);
  const {
    url,
    headers,
    onMessage,
    onError,
    onOpen,
    autoConnect = true,
    withCredentials = true
  } = options;

  const handleMessage = useCallback((event: MessageEvent) => {
    if (onMessage) {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    }
  }, [onMessage]);

  const connect = useCallback(() => {
    sseService.connect({
      url,
      headers,
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
