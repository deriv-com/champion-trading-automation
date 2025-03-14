import { createContext, useContext, useState, ReactNode } from 'react';
import { BalanceData } from '../types/balance';
import { balanceService } from '../services/balance/balanceService';

interface BalanceContextType {
  balanceData: BalanceData | null;
  isLoading: boolean;
  error: string | null;
  updateBalance: (data: BalanceData) => void;
  refreshBalance: () => Promise<void>;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function BalanceProvider({ children }: { children: ReactNode }) {
  // Initialize with default values instead of null
  const [balanceData, setBalanceData] = useState<BalanceData>({
    balance: '0.00',
    change: '0.00',
    contract_id: '',
    currency: 'USD',
    timestamp: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch initial balance
  const refreshBalance = async () => {
    setIsLoading(true);
    try {
      const initialBalance = await balanceService.fetchInitialBalance();
      setBalanceData(initialBalance);
      setError(null);
    } catch (err) {
      console.error('BalanceContext: Error fetching initial balance:', err);
      setError('Failed to fetch initial balance');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBalance = (data: BalanceData) => {
    if (!data || !data.balance) {
      console.warn('BalanceContext: Invalid balance data received');
      return;
    }
    
    // Explicitly create a new BalanceData object with all required fields
    const newBalanceData: BalanceData = {
      balance: data.balance,
      change: data.change || '0.00',
      contract_id: data.contract_id || '',
      currency: data.currency || 'USD',
      timestamp: data.timestamp || new Date().toISOString()
    };
    
    // Use a callback to ensure we're working with the latest state
    setBalanceData(prevData => {
      // Only update if the balance has actually changed
      if (prevData.balance !== newBalanceData.balance) {
        return newBalanceData;
      }
      return prevData;
    });
    
    setIsLoading(false);
    setError(null);
  };


  return (
    <BalanceContext.Provider value={{ balanceData, isLoading, error, updateBalance, refreshBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
}