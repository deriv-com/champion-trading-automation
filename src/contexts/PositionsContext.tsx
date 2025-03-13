import React, { createContext, useContext, useEffect, useCallback, useReducer } from 'react';
import { TradeInfo } from '../types/trade';
import { tradeService } from '../services/trade/tradeService';
import { useSSEContext } from './SSEContext';

// Define the context state and actions
interface PositionsState {
  trades: Record<string, TradeInfo>; // Keyed by session_id for efficient updates
  loading: boolean;
  error: string | null;
  lastUpdated: Record<string, Date>; // Track when each position was last updated
}

type PositionsAction = 
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS', payload: TradeInfo[] }
  | { type: 'FETCH_ERROR', payload: string }
  | { type: 'UPDATE_POSITION', payload: TradeInfo }
  | { type: 'CLOSE_POSITION', payload: string };

// Context interface
interface PositionsContextType {
  state: PositionsState;
  fetchTrades: () => Promise<void>;
  closePosition: (sessionId: string) => Promise<void>;
  isConnected: boolean;
}

const PositionsContext = createContext<PositionsContextType | undefined>(undefined);

// Reducer for state management
function positionsReducer(state: PositionsState, action: PositionsAction): PositionsState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    
    case 'FETCH_SUCCESS': {
      const tradesMap: Record<string, TradeInfo> = {};
      const now = new Date();
      const lastUpdated: Record<string, Date> = {};
      
      action.payload.forEach(trade => {
        tradesMap[trade.session_id] = trade;
        lastUpdated[trade.session_id] = now;
      });
      
      return { 
        ...state, 
        trades: tradesMap, 
        loading: false, 
        error: null,
        lastUpdated
      };
    }
    
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    
    case 'UPDATE_POSITION': {
      const trade = action.payload;
      const now = new Date();
      
      return {
        ...state,
        trades: {
          ...state.trades,
          [trade.session_id]: trade
        },
        lastUpdated: {
          ...state.lastUpdated,
          [trade.session_id]: now
        }
      };
    }
    
    case 'CLOSE_POSITION': {
      const newTrades = { ...state.trades };
      const newLastUpdated = { ...state.lastUpdated };
      
      delete newTrades[action.payload];
      delete newLastUpdated[action.payload];
      
      return {
        ...state,
        trades: newTrades,
        lastUpdated: newLastUpdated
      };
    }
    
    default:
      return state;
  }
}

export function PositionsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(positionsReducer, {
    trades: {},
    loading: true,
    error: null,
    lastUpdated: {}
  });
  
  // Use the existing SSE connection from SSEContext
  const { isConnected, lastMessage } = useSSEContext();
  
  // Process SSE messages when they arrive
  useEffect(() => {
    if (lastMessage && typeof lastMessage === 'object') {
      try {
        // Handle trade update message
        if ('session_id' in lastMessage && 'trade_info' in lastMessage) {
          dispatch({
            type: 'UPDATE_POSITION',
            payload: (lastMessage as any).trade_info
          });
          
          // If the trade is completed, we might want to handle it differently
          if ('is_completed' in lastMessage && (lastMessage as any).is_completed) {
            console.log('Trade completed:', (lastMessage as any).session_id);
          }
        }
      } catch (error) {
        console.error('Error processing SSE message:', error);
      }
    }
  }, [lastMessage]);
  
  // Fetch initial trade data
  const fetchTrades = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    
    try {
      const response = await tradeService.checkTradeStatus();
      if (response && Array.isArray(response.tradeinfo_list)) {
        dispatch({ 
          type: 'FETCH_SUCCESS', 
          payload: response.tradeinfo_list 
        });
      }
    } catch (err) {
      dispatch({ 
        type: 'FETCH_ERROR', 
        payload: 'Failed to fetch trading positions. Please try again later.' 
      });
      console.error('Error fetching trades:', err);
    }
  }, []);
  
  // Close a position
  const closePosition = useCallback(async (sessionId: string) => {
    try {
      // Call the API to stop trading for this session
      await tradeService.stopTrading(sessionId);
      
      // Remove it from the state
      dispatch({ type: 'CLOSE_POSITION', payload: sessionId });
    } catch (err) {
      console.error('Error closing position:', err);
    }
  }, []);
  
  // We don't automatically fetch trades on mount
  // This will be done by the Positions component when it mounts
  // No periodic refresh - we rely on SSE for updates
  
  const value = {
    state,
    fetchTrades,
    closePosition,
    isConnected
  };
  
  return (
    <PositionsContext.Provider value={value}>
      {children}
    </PositionsContext.Provider>
  );
}

export function usePositions() {
  const context = useContext(PositionsContext);
  if (context === undefined) {
    throw new Error('usePositions must be used within a PositionsProvider');
  }
  return context;
}