/**
 * @file: Positions/index.tsx
 * @description: Component for displaying and managing trading positions,
 *               including filtering, sorting, and position management.
 *
 * @components:
 *   - Positions: Main component for positions display
 *   - TradeFilters: Sub-component for filtering positions
 *   - TradeGrid: Sub-component for displaying position data in a grid
 * @dependencies:
 *   - React: Core functionality and hooks
 *   - antd: UI components (Alert, Spin, Typography)
 *   - contexts/PositionsContext: Trading positions data and actions
 *   - types/positions: Position-related type definitions
 * @usage:
 *   <Positions />
 *
 * @architecture: Container component with filtering and child components
 * @relationships:
 *   - Parent: PositionsPage
 *   - Children: TradeFilters, TradeGrid
 *   - Context: Uses PositionsContext for data and actions
 * @dataFlow:
 *   - Input: Trading positions from PositionsContext
 *   - Processing: Filtering and sorting based on user selections
 *   - Output: Filtered positions display and position management actions
 *
 * @ai-hints: This component handles the display logic for trading positions,
 *            including filtering, sorting, and empty state handling. It uses
 *            the PositionsContext to fetch and manage position data, with
 *            optimizations to prevent redundant API calls.
 */
import React, { useState, useEffect, useRef } from 'react';
import { Alert, Spin, Typography, Tabs } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { usePositions } from '../../contexts/PositionsContext';
import TradeGrid from './components/TradeGrid';
import './styles.scss';

const { Title } = Typography;
const { TabPane } = Tabs;

const Positions: React.FC = () => {
  const { state, closePosition, fetchTrades } = usePositions();
  const [activeTab, setActiveTab] = useState<string>('open');
  const hasFetched = useRef(false);

  // Fetch trades when the component mounts, but only once
  useEffect(() => {
    if (!hasFetched.current) {
      fetchTrades();
      hasFetched.current = true;
    }
  }, [fetchTrades]);

  const getOpenAndClosedTrades = () => {
    // Convert trades object to array
    const allTrades = Object.values(state.trades);
    
    // Separate open and closed trades
    const openTrades = allTrades.filter(trade =>
      trade.status !== 'stopped' && trade.status !== 'error' && trade.status !== 'completed'
    );
    
    const closedTrades = allTrades.filter(trade =>
      trade.status === 'stopped' || trade.status === 'error' || trade.status === 'completed'
    );
    
    // Sort by start time (newest first)
    const sortTrades = (trades: any[]) => {
      return [...trades].sort((a, b) =>
        new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
      );
    };
    
    return {
      openTrades: sortTrades(openTrades),
      closedTrades: sortTrades(closedTrades)
    };
  };

  const { openTrades, closedTrades } = getOpenAndClosedTrades();

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  // Handle position closing and switch to Closed tab
  const handleClosePosition = async (sessionId: string) => {
    const result = await closePosition(sessionId);
    if (result) {
      // Switch to the Closed Positions tab
      setActiveTab('closed');
    }
  };

  const renderTabContent = (trades: any[], tabType: string) => {
    if (state.loading) {
      return (
        <div className="positions__loading">
          <Spin size="large" />
        </div>
      );
    }
    
    if (trades.length === 0) {
      return (
        <div className="positions__empty">
          <SwapOutlined />
          <Title level={3}>
            {tabType === 'open' ? 'No Active Positions' : 'No Closed Positions'}
          </Title>
          <p>
            {tabType === 'open'
              ? 'There are currently no active trading positions to display.'
              : 'There are currently no closed trading positions to display.'}
          </p>
        </div>
      );
    }
    
    return (
      <TradeGrid
        trades={trades}
        loading={false}
        onClose={handleClosePosition}
        lastUpdated={state.lastUpdated}
      />
    );
  };

  return (
    <div className="positions">
      <div className="positions__header">
        <div className="positions__title">
          <Title level={1}>Trading Positions</Title>
        </div>
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
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            className="positions__tabs"
          >
            <TabPane tab="Open Positions" key="open">
              {renderTabContent(openTrades, 'open')}
            </TabPane>
            <TabPane tab="Closed Positions" key="closed">
              {renderTabContent(closedTrades, 'closed')}
            </TabPane>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Positions;