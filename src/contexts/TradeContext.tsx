/**
 * @file: TradeContext.tsx
 * @description: React context provider for managing trade execution and state,
 *               supporting multiple trading strategies and session tracking.
 *
 * @components:
 *   - TradeContext: React context for trade state
 *   - TradeProvider: Provider component that manages trade state
 *   - useTrade: Custom hook for consuming trade context
 *   - TradeSession: Interface for trade session data structure
 * @dependencies:
 *   - React: createContext, useContext, useState
 *   - types/trade: TradeStatusEnum, TradeStrategy, TradeStatus
 *   - types/form: FormValues for trade parameters
 *   - services/trade/tradeService: Service for executing trades
 * @usage:
 *   // Wrap components that need trade functionality
 *   <TradeProvider>
 *     <YourComponent />
 *   </TradeProvider>
 *
 *   // Use trade functionality in components
 *   const { submitTrade, isSubmitting } = useTrade();
 *
 *   // Submit a trade
 *   const handleSubmit = async (values) => {
 *     try {
 *       const sessionId = await submitTrade(values, TradeStrategy.REPEAT);
 *       console.log(`Trade submitted with session ID: ${sessionId}`);
 *     } catch (error) {
 *       console.error('Trade submission failed:', error);
 *     }
 *   };
 *
 * @architecture: Context Provider with complex state management
 * @relationships:
 *   - Used by: Trading form components
 *   - Related to: PositionsContext for tracking active positions
 * @dataFlow:
 *   - Input: Trade parameters from form submissions
 *   - Processing: Trade execution via tradeService
 *   - State: Tracks trade sessions by strategy and session ID
 *
 * @ai-hints: This context manages trade execution state with a nested structure
 *            organized by strategy and session ID. It handles the complete lifecycle
 *            of trade submissions including pending, active, and error states.
 *            The state structure allows tracking multiple concurrent trades across
 *            different strategies.
 */
import { createContext, useContext, useState, ReactNode } from 'react';
import {
  TradeStatusEnum, TradeStrategy, TradeStatus
} from '../types/trade';
import { FormValues } from '../types/form';
import { tradeService } from '../services/trade/tradeService';

type TradeRequest = FormValues;
type TradeResponse = TradeStatus;

interface TradeSession<TRequest = TradeRequest, TResponse = TradeResponse> {
  sessionId: string;
  status: TradeStatusEnum;
  params: TRequest;
  response?: TResponse;
  error?: string;
}

type TradeSessionMap = Record<string, TradeSession>;
type TradeStateMap = Record<TradeStrategy, TradeSessionMap>;

interface TradeContextState {
  trades: TradeStateMap;
  isSubmitting: boolean;
}

interface TradeContextValue extends TradeContextState {
  submitTrade: (request: TradeRequest, strategy: TradeStrategy) => Promise<string>;
  updateTradeSession: (strategy: TradeStrategy, sessionId: string, updates: Partial<TradeSession>) => void;
  getTradeSession: (strategy: TradeStrategy, sessionId: string) => TradeSession | undefined;
  getTradeSessionsByStrategy: (strategy: TradeStrategy) => TradeSessionMap;
  resetTradeState: () => void;
}

const TradeContext = createContext<TradeContextValue | undefined>(undefined);

export function TradeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TradeContextState>({
    trades: {
      [TradeStrategy.REPEAT]: {},
      [TradeStrategy.MARTINGALE]: {},
      [TradeStrategy.THRESHOLD]: {}
    },
    isSubmitting: false
  });

  const submitTrade = async (request: TradeRequest, strategy: TradeStrategy): Promise<string> => {
    // Generate a unique session ID
    const sessionId = Math.random().toString(36).substring(7).toUpperCase();
    
    try {
      setState(prev => ({ ...prev, isSubmitting: true }));
      
      // Create new trade session
      const newSession: TradeSession = {
        sessionId,
        status: TradeStatusEnum.PENDING,
        params: request
      };

      // Update state with new session
      setState(prev => ({
        ...prev,
        trades: {
          ...prev.trades,
          [strategy]: {
            ...prev.trades[strategy],
            [sessionId]: newSession
          }
        }
      }));

      const tradeRequest = {
        proposal: 1,
        currency: 'USD',
        basis: 'stake',
        contract_type: 'ACCU',
        ...request,
      }

      // Execute trade using tradeService
      const response = await tradeService.executeTrade<TradeRequest, TradeResponse>(
        tradeRequest,
        strategy
      );

      console.log(response);

      // Update session with response
      setState(prev => ({
        ...prev,
        trades: {
          ...prev.trades,
          [strategy]: {
            ...prev.trades[strategy],
            [sessionId]: {
              ...prev.trades[strategy][sessionId],
              response
            }
          }
        }
      }));

      // Update session status to active
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        trades: {
          ...prev.trades,
          [strategy]: {
            ...prev.trades[strategy],
            [sessionId]: {
              ...prev.trades[strategy][sessionId],
              status: TradeStatusEnum.ACTIVE
            }
          }
        }
      }));

      return sessionId;

    } catch (error) {
      // Update session with error
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        trades: {
          ...prev.trades,
          [strategy]: {
            ...prev.trades[strategy],
            [sessionId]: {
              ...prev.trades[strategy][sessionId],
              status: TradeStatusEnum.ERROR,
              error: error instanceof Error ? error.message : 'Failed to submit trade'
            }
          }
        }
      }));
      throw error;
    }
  };

  const updateTradeSession = (strategy: TradeStrategy, sessionId: string, updates: Partial<TradeSession>) => {
    setState(prev => ({
      ...prev,
      trades: {
        ...prev.trades,
        [strategy]: {
          ...prev.trades[strategy],
          [sessionId]: {
            ...prev.trades[strategy][sessionId],
            ...updates
          }
        }
      }
    }));
  };

  const getTradeSession = (strategy: TradeStrategy, sessionId: string): TradeSession | undefined => {
    return state.trades[strategy]?.[sessionId];
  };

  const getTradeSessionsByStrategy = (strategy: TradeStrategy): TradeSessionMap => {
    return state.trades[strategy] || {};
  };

  const resetTradeState = () => {
    setState({
      trades: {
        [TradeStrategy.REPEAT]: {},
        [TradeStrategy.MARTINGALE]: {},
        [TradeStrategy.THRESHOLD]: {}
      },
      isSubmitting: false
    });
  };

  return (
    <TradeContext.Provider 
      value={{
        ...state,
        submitTrade,
        updateTradeSession,
        getTradeSession,
        getTradeSessionsByStrategy,
        resetTradeState
      }}
    >
      {children}
    </TradeContext.Provider>
  );
}

export function useTrade() {
  const context = useContext(TradeContext);
  if (context === undefined) {
    throw new Error('useTrade must be used within a TradeProvider');
  }
  return context;
}
