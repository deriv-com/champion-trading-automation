import { useEffect, useState, useCallback } from 'react';
import { useBalance } from '../contexts/BalanceContext';
import { useAuth } from '../contexts/AuthContext';
import { BalanceData } from '../types/balance';
import { balanceService } from '../services/balance/balanceService';
import { balanceStreamService } from '../services/balance/balanceStreamService';

// Flag to track if initial balance has been fetched
let initialBalanceFetched = false;
// Flag to track if balance stream connection has been established
let balanceStreamEstablished = false;
// Flag to track if we're currently connecting to the balance stream
let isConnectingToBalanceStream = false;

/**
 * useBalanceSSE: Custom hook for managing balance SSE connection
 * Uses the sseService singleton to ensure only one SSE connection is established
 */
export function useBalanceSSE() {
  const { balanceData, updateBalance, refreshBalance } = useBalance();
  const { authParams, authorizeResponse } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  
  // Check if the user is logged in
  const isLoggedIn = !!(authParams?.token1 && authorizeResponse?.authorize);
  
  // Fetch initial balance only once when logged in
  useEffect(() => {
    if (isLoggedIn && !initialBalanceFetched) {
      refreshBalance();
      initialBalanceFetched = true;
    }
  }, [isLoggedIn, refreshBalance]); // Run when login state changes
  
  // Process message handler - defined with useCallback to prevent recreation
  const processMessage = useCallback((balanceData: BalanceData) => {
    // Update balance with the data
    updateBalance(balanceData);
  }, [updateBalance]);
  
  // Connect to the balance stream only once when logged in
  useEffect(() => {
    // Only connect if the user is logged in and we haven't established a connection
    if (isLoggedIn && !balanceStreamEstablished && !isConnectingToBalanceStream) {
      // Set the connecting flag
      isConnectingToBalanceStream = true;
      
      // Connect to the balance stream
      balanceStreamService.connect(
        balanceService.getBalanceStreamUrl(),
        processMessage
      );
      
      // Mark the connection as established
      balanceStreamEstablished = true;
    } else if (!isLoggedIn && balanceStreamEstablished) {
      // If user logged out and we had a connection, reset the connection state
      balanceStreamService.handleLogout();
      balanceStreamEstablished = false;
      isConnectingToBalanceStream = false;
    }
    
    // Set up an interval to check the connection status only if logged in
    let checkConnectionInterval: number | undefined;
    
    if (isLoggedIn) {
      checkConnectionInterval = window.setInterval(() => {
        const connected = balanceStreamService.getConnectionStatus();
        setIsConnected(connected);
      }, 1000);
    } else {
      // If not logged in, ensure we show as disconnected
      setIsConnected(false);
    }
    
    // Cleanup function
    return () => {
      if (checkConnectionInterval) {
        clearInterval(checkConnectionInterval);
      }
      // Note: We don't disconnect on unmount, as other components may be using the connection
    };
  }, [isLoggedIn, processMessage]); // Depend on login state and processMessage
  
  
  return { isConnected, balanceData };
}