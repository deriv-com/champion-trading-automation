import React, { useEffect, useState, useRef } from 'react';
import { Card, Typography, Tag, Tooltip, Space } from 'antd';
import {
  ClockCircleOutlined,
  DollarOutlined,
  SwapOutlined,
  AimOutlined
} from '@ant-design/icons';
import { TradeCardProps } from '../../../../types/positions';
import { TradeStrategy } from '../../../../types/trade';
import './styles.scss';

const { Text, Title } = Typography;

// Helper functions for strategy display
const getStrategyLabel = (strategy: string): string => {
  switch (strategy) {
    case TradeStrategy.REPEAT:
      return 'Repeat Trade';
    case TradeStrategy.MARTINGALE:
      return 'Martingale Trade';
    case TradeStrategy.DALEMBERT:
      return 'D\'Alembert Trade';
    default:
      return strategy || 'Unknown Strategy';
  }
};

const getStrategyColor = (strategy: string): string => {
  switch (strategy) {
    case TradeStrategy.REPEAT:
      return 'blue';
    case TradeStrategy.MARTINGALE:
      return 'green';
    case TradeStrategy.DALEMBERT:
      return 'purple';
    default:
      return 'default';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatProfit = (profit: number | undefined) => {
  if (profit === undefined) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(profit);
};

const TradeCard: React.FC<TradeCardProps> = ({ trade, loading, onClose: _, lastUpdated }) => {
  const [highlight, setHighlight] = useState(false);
  const prevProfitRef = useRef(trade.total_profit);
  const prevContractsRef = useRef(trade.contracts?.map(c => c.profit) || []);
  
  // Add animation when profit changes
  useEffect(() => {
    if (lastUpdated) {
      // Check if total profit changed
      if (prevProfitRef.current !== trade.total_profit) {
        setHighlight(true);
        const timer = setTimeout(() => {
          setHighlight(false);
        }, 2000);
        
        prevProfitRef.current = trade.total_profit;
        return () => clearTimeout(timer);
      }
      
      // Check if any contract profits changed
      if (trade.contracts && trade.contracts.length > 0) {
        const contractsChanged = trade.contracts.some((contract, index) => {
          return index >= prevContractsRef.current.length ||
                 contract.profit !== prevContractsRef.current[index];
        });
        
        if (contractsChanged) {
          setHighlight(true);
          const timer = setTimeout(() => {
            setHighlight(false);
          }, 2000);
          
          prevContractsRef.current = trade.contracts.map(c => c.profit);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [trade, lastUpdated]);
  
  const isProfit = trade.total_profit > 0;
  const profitClass = isProfit ? 'profit' : 'loss';

  const renderStrategyDetails = () => {
    // Common details for all strategies
    const commonDetails = (
      <Text>
        <DollarOutlined /> Initial Amount: {formatProfit(trade.initial)}
      </Text>
    );

    switch (trade.strategy) {
      case TradeStrategy.REPEAT:
        return (
          <Space direction="vertical" size="small">
            {commonDetails}
            <Text>
              <SwapOutlined /> Number of Trades: {trade.number_of_trade}
            </Text>
          </Space>
        );
      
      case TradeStrategy.MARTINGALE:
        return (
          <Space direction="vertical" size="small">
            {commonDetails}
            <Text>
              <SwapOutlined /> Number of Trades: {trade.number_of_trade}
            </Text>
            <Text>
              <AimOutlined /> Thresholds: {formatProfit(trade.profit_threshold)} / {formatProfit(trade.loss_threshold)}
            </Text>
          </Space>
        );
      
      case TradeStrategy.DALEMBERT:
      default:
        return (
          <Space direction="vertical" size="small">
            {commonDetails}
            <Text>
              <ClockCircleOutlined /> Duration: {trade.duration} minutes
            </Text>
            <Text>
              <AimOutlined /> Thresholds: {formatProfit(trade.profit_threshold)} / {formatProfit(trade.loss_threshold)}
            </Text>
          </Space>
        );
    }
  };

  return (
    <Card
      className={`trade-card ${profitClass} ${highlight ? 'updated' : ''}`}
      loading={loading}
      hoverable
    >
      <div className="trade-card__header">
        <div className="trade-card__header-tags">
          <Tag color={getStrategyColor(trade.strategy)}>
            {getStrategyLabel(trade.strategy)}
          </Tag>
          {trade.status && (
            <Tag color={trade.status === 'error' ? 'red' : trade.status === 'stopped' ? 'orange' : 'green'}>
              {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
            </Tag>
          )}
        </div>
        <Tooltip title="Session ID">
          <Text className="trade-card__session-id" copyable>
            {trade.session_id}
          </Text>
        </Tooltip>
      </div>

      <div className="trade-card__time">
        <ClockCircleOutlined /> {formatDate(trade.start_time)}
      </div>

      <div className="trade-card__profit">
        <Title level={3} className={profitClass}>
          {formatProfit(trade.total_profit)}
        </Title>
      </div>

      <div className="trade-card__details">
        {renderStrategyDetails()}
      </div>

      {trade.contracts && trade.contracts.length > 0 && (
        <div className="trade-card__contracts">
          <Text strong>Contracts</Text>
          <div className="trade-card__contracts-list">
            {trade.contracts.map((contract, index) => (
              <div key={contract.contract_id || index} className="trade-card__contract">
                <Text type="secondary">#{index + 1}</Text>
                <Text copyable={{ text: contract.contract_id || '' }}>
                  {contract.contract_id ? `${contract.contract_id.slice(0, 8)}...` : 'N/A'}
                </Text>
                <Text className={contract.profit > 0 ? 'profit' : 'loss'}>
                  {formatProfit(contract.profit)}
                </Text>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="trade-card__actions">
        {trade.status === 'stopped' || trade.status === 'error' ? (
          <></>
        ) : (
          // <Button
          //   type="primary"
          //   onClick={() => onClose?.(trade.session_id)}
          //   disabled={loading}
          // >
          //   Close Position
          // </Button>
          <></>
        )}
      </div>
    </Card>
  );
};

export default TradeCard;