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
