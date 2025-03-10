import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ProcessingStack, { ProcessInfo } from '../components/ProcessingStack';

interface ProcessingStackContextType {
  addProcess: (process: Omit<ProcessInfo, 'id' | 'timestamp'>) => void;
  processes: ProcessInfo[];
}

const ProcessingStackContext = createContext<ProcessingStackContextType | undefined>(undefined);

/**
 * ProcessingStackProvider: Provides process management for trading operations.
 * Inputs: { children: ReactNode } - Child components to be wrapped with the context
 * Output: JSX.Element - Context provider with processes state and ProcessingStack component
 */
export function ProcessingStackProvider({ children }: { children: ReactNode }) {
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);

  // Clean up expired processes (older than 7 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setProcesses(prev => prev.filter(process => now - process.timestamp < 7000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);
/**
 * addProcess: Adds a new process to the stack and simulates its progress over time.
 * Inputs: process: Omit<ProcessInfo, 'id' | 'timestamp'> - Process data without ID and timestamp
 * Output: void - Updates processes state and sets up simulation interval
 */
const addProcess = (process: Omit<ProcessInfo, 'id' | 'timestamp'>) => {
  const id = Math.random().toString(36).substr(2, 9);
  const timestamp = Date.now();
  
    
    const newProcess: ProcessInfo = {
      ...process,
      id,
      timestamp
    };
    setProcesses(prev => [...prev, newProcess]);

    // Simulate progress
    let completedTrades = 0;
    let profit = 0;
    const interval = setInterval(() => {
      if (completedTrades < (process.tradeInfo.number_of_trade ?? 0)) {
        completedTrades++;
        profit += Math.random() * 2 - 1; // Random profit between -1 and 1
        
        setProcesses(prev => 
          prev.map(p => 
            p.id === id 
              ? { ...p, completedTrades, profit }
              : p
          )
        );
      } else {
        clearInterval(interval);
      }
    }, 1000);

    // Process will be auto-removed by the cleanup effect after 7 seconds
  };

  return (
    <ProcessingStackContext.Provider value={{ processes, addProcess }}>
      {children}
      <ProcessingStack processes={processes} />
    </ProcessingStackContext.Provider>
  );
}

/**
 * useProcessingStack: Hook to access the processing stack context values and methods.
 * Inputs: None
 * Output: ProcessingStackContextType - Object with processes array and addProcess function
 * Throws: Error if used outside of ProcessingStackProvider
 */
export function useProcessingStack() {
  const context = useContext(ProcessingStackContext);
  if (!context) {
    throw new Error('useProcessingStack must be used within a ProcessingStackProvider');
  }
  return context;
}
