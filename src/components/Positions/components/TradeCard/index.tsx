import React, { useEffect, useState, useRef } from 'react';
import { Card, Typography, Tag, Tooltip, Space, Button } from 'antd';
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatProfit = (profit: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(profit);
};

const TradeCard: React.FC<TradeCardProps> = ({ trade, loading, onClose, lastUpdated }) => {
  const [highlight, setHighlight] = useState(false);
  const prevProfitRef = useRef(trade.total_profit);
  const prevContractsRef = useRef(trade.contracts.map(c => c.profit));
  
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
  }, [trade, lastUpdated]);
  
  const isProfit = trade.total_profit > 0;
  const profitClass = isProfit ? 'profit' : 'loss';

  const renderStrategyDetails = () => {
    if (trade.strategy === TradeStrategy.REPEAT) {
      return (
        <Space direction="vertical" size="small">
          <Text>
            <SwapOutlined /> Number of Trades: {trade.number_of_trade}
          </Text>
          <Text>
            <DollarOutlined /> Initial Amount: {formatProfit(trade.initial)}
          </Text>
        </Space>
      );
    }

    return (
      <Space direction="vertical" size="small">
        <Text>
          <ClockCircleOutlined /> Duration: {trade.duration} minutes
        </Text>
        <Text>
          <AimOutlined /> Thresholds: {formatProfit(trade.profit_threshold)} / {formatProfit(trade.loss_threshold)}
        </Text>
      </Space>
    );
  };

  return (
    <Card
      className={`trade-card ${profitClass} ${highlight ? 'updated' : ''}`}
      loading={loading}
      hoverable
    >
      <div className="trade-card__header">
        <Tag color={trade.strategy === TradeStrategy.REPEAT ? 'blue' : 'purple'}>
          {trade.strategy === TradeStrategy.REPEAT ? 'Repeat Trade' : 'Threshold Trade'}
        </Tag>
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

      {trade.contracts.length > 0 && (
        <div className="trade-card__contracts">
          <Text strong>Contracts</Text>
          <div className="trade-card__contracts-list">
            {trade.contracts.map((contract, index) => (
              <div key={contract.buy_id} className="trade-card__contract">
                <Text type="secondary">#{index + 1}</Text>
                <Text copyable={{ text: contract.buy_id }}>
                  {contract.buy_id.slice(0, 8)}...
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
        <Button
          type="primary"
          onClick={() => onClose?.(trade.session_id)}
          disabled={loading}
        >
          Close Position
        </Button>
      </div>
    </Card>
  );
};

export default TradeCard;