import React, { useState, useEffect, useRef } from 'react';
import { Alert, Spin, Typography } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { PositionsFilters } from '../../types/positions';
import { usePositions } from '../../contexts/PositionsContext';
import TradeFilters from './components/TradeFilters';
import TradeGrid from './components/TradeGrid';
import './styles.scss';

const { Title } = Typography;

const DEFAULT_FILTERS: PositionsFilters = {
  strategy: null,
  profitStatus: 'all',
  sortBy: 'time',
  sortDirection: 'desc',
};

const Positions: React.FC = () => {
  const { state, closePosition, fetchTrades } = usePositions();
  const [filters, setFilters] = useState<PositionsFilters>(DEFAULT_FILTERS);
  const hasFetched = useRef(false);

  // Fetch trades when the component mounts, but only once
  useEffect(() => {
    if (!hasFetched.current) {
      fetchTrades();
      hasFetched.current = true;
    }
  }, [fetchTrades]);

  const handleFiltersChange = (newFilters: PositionsFilters) => {
    setFilters(newFilters);
  };

  const getFilteredTrades = () => {
    // Convert trades object to array
    let filteredTrades = Object.values(state.trades);

    // Apply strategy filter
    if (filters.strategy) {
      filteredTrades = filteredTrades.filter(
        trade => trade.strategy === filters.strategy
      );
    }

    // Apply profit status filter
    if (filters.profitStatus !== 'all') {
      filteredTrades = filteredTrades.filter(trade => {
        if (filters.profitStatus === 'profit') {
          return trade.total_profit > 0;
        }
        return trade.total_profit < 0;
      });
    }

    // Apply sorting
    filteredTrades.sort((a, b) => {
      const multiplier = filters.sortDirection === 'asc' ? 1 : -1;
      
      if (filters.sortBy === 'time') {
        return multiplier * (
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
      }
      
      return multiplier * (a.total_profit - b.total_profit);
    });

    return filteredTrades;
  };

  const filteredTrades = getFilteredTrades();

  return (
    <div className="positions">
      <div className="positions__header">
        <div className="positions__title">
          <Title level={1}>Trading Positions</Title>
          {/* {isConnected && (
            <Badge status="processing" text="Live Updates" className="positions__live-indicator" />
          )} */}
        </div>
        <TradeFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          loading={state.loading}
        />
      </div>

      <div className="positions__content">
        {state.error ? (
          <Alert
            message="Error"
            description={state.error}
            type="error"
            showIcon
            className="positions__error"
          />
        ) : (
          <>
            <TradeGrid
              trades={filteredTrades}
              loading={state.loading}
              onClose={closePosition}
              lastUpdated={state.lastUpdated}
            />
            {state.loading && (
              <div className="positions__loading">
                <Spin size="large" />
              </div>
            )}
            {!state.loading && filteredTrades.length === 0 && (
              <div className="positions__empty">
                <SwapOutlined />
                <Title level={3}>No Active Positions</Title>
                <p>There are currently no active trading positions to display.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Positions;