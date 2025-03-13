import React from 'react';
import { Card } from 'antd';
import TradeCard from '../TradeCard';
import { TradeGridProps } from '../../../../types/positions';
import './styles.scss';

const LOADING_CARDS = 8;

const TradeGrid: React.FC<TradeGridProps> = ({ trades, loading, onClose, lastUpdated }) => {
  if (loading) {
    return (
      <div className="trade-grid">
        {Array.from({ length: LOADING_CARDS }).map((_, index) => (
          <Card key={index} loading className="trade-card" />
        ))}
      </div>
    );
  }

  return (
    <div className="trade-grid">
      {trades.map((trade) => (
        <TradeCard
          key={trade.session_id}
          trade={trade}
          onClose={onClose}
          lastUpdated={lastUpdated?.[trade.session_id]}
        />
      ))}
    </div>
  );
};

export default TradeGrid;