import { useEffect, useState, useCallback } from 'react';
import { useBalance } from '../contexts/BalanceContext';
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
  const [isConnected, setIsConnected] = useState(false);
  
  // Always connected for SSE connection purposes
  
  // Fetch initial balance only once
  useEffect(() => {
    if (!initialBalanceFetched) {
      refreshBalance();
      initialBalanceFetched = true;
    }
  }, [refreshBalance]); // No longer dependent on login state
  
  // Process message handler - defined with useCallback to prevent recreation
  const processMessage = useCallback((balanceData: BalanceData) => {
    // Update balance with the data
    updateBalance(balanceData);
  }, [updateBalance]);
  
  // Connect to the balance stream regardless of login status
  useEffect(() => {
    // Connect if we haven't established a connection yet
    if (!balanceStreamEstablished && !isConnectingToBalanceStream) {
      // Set the connecting flag
      isConnectingToBalanceStream = true;
      
      // Connect to the balance stream
      balanceStreamService.connect(
        balanceService.getBalanceStreamUrl(),
        processMessage
      );
      
      // Mark the connection as established
      balanceStreamEstablished = true;
    }
    
    // Set up an interval to check the connection status
    let checkConnectionInterval: number | undefined;
    
    checkConnectionInterval = window.setInterval(() => {
      const connected = balanceStreamService.getConnectionStatus();
      setIsConnected(connected);
    }, 1000);
    
    // Cleanup function
    return () => {
      if (checkConnectionInterval) {
        clearInterval(checkConnectionInterval);
      }
      // Note: We don't disconnect on unmount, as other components may be using the connection
    };
  }, [processMessage]); // Only depend on processMessage, not login state
  
  
  return { isConnected, balanceData };
}