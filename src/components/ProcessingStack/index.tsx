import React from 'react';
import { Card, Progress, Typography, Space, Button } from 'antd';
import { 
  LoadingOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { TradeStatusEnum } from '../../types/trade';
import './styles.scss';

const { Text } = Typography;

const AUTO_REMOVE_DELAY = 5000; // 5 seconds for completed/error states

interface TradeInfo {
  session_id: string;
  contracts: any[] | null;
  start_time: string;
  end_time: string;
  total_profit: number;
  win_profit: number;
  loss_profit: number;
  strategy: string;
  number_of_trade?: number;
  initial?: number;
}

export interface ProcessInfo {
  id: string;
  sessionId: string;
  symbol: string;
  error?: string;
  strategy: string;
  tradeInfo: TradeInfo;
  timestamp: number;
  status: TradeStatusEnum;
  is_completed: boolean;
}

interface StatusConfig {
  icon: React.ReactNode;
  color: string;
  text: string;
}

/**
 * getStatusConfig: Determines the visual status configuration based on process state.
 * Inputs: process: ProcessInfo - The process object to evaluate
 * Output: StatusConfig - Object with icon, color, and text for the process status
 */
const getStatusConfig = (process: ProcessInfo): StatusConfig => {
  if (process.error) {
    return {
      icon: <CloseCircleOutlined />,
      color: 'var(--error-color)',
      text: 'Error'
    };
  }

  if (process.is_completed) {
    return {
      icon: <CheckCircleOutlined />,
      color: 'var(--success-color)',
      text: 'Completed'
    };
  }

  return {
    icon: <LoadingOutlined />,
    color: 'var(--accent-color)',
    text: 'Active'
  };
};

/**
 * formatDateTime: Formats a date string to a localized time string.
 * Inputs: dateStr: string - The date string to format
 * Output: string - Formatted time string or empty string for invalid dates
 */
const formatDateTime = (dateStr: string) => {
  if (!dateStr || dateStr === '0001-01-01T00:00:00Z') return '';
  return new Date(dateStr).toLocaleTimeString();
};

interface ProcessingCardProps {
  process: ProcessInfo;
  onRemove: (id: string) => void;
}

/**
 * ProcessingCard: Card component that displays trading process information with status indicators.
 * Inputs: { process: ProcessInfo, onRemove: (id: string) => void } - Process data and removal callback
 * Output: JSX.Element - Card with process details, status indicators, and progress visualization
 */
function ProcessingCard({ process, onRemove }: ProcessingCardProps) {
  const [fadeOut, setFadeOut] = useState(false);
  const statusConfig = getStatusConfig(process);
  const completedTrades = process.tradeInfo.contracts?.length ?? 0;
  const totalTrades = process.tradeInfo.number_of_trade ?? 0;
  const progress = totalTrades > 0 ? Math.round((completedTrades / totalTrades) * 100) : 0;

  useEffect(() => {
    let fadeTimer: NodeJS.Timeout;
    let removeTimer: NodeJS.Timeout;

    if (process.is_completed || process.error) {
      fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, AUTO_REMOVE_DELAY - 300);

      removeTimer = setTimeout(() => {
        onRemove(process.id);
      }, AUTO_REMOVE_DELAY);
    }

    return () => {
      if (fadeTimer) clearTimeout(fadeTimer);
      if (removeTimer) clearTimeout(removeTimer);
    };
  }, [process.is_completed, process.error, process.id, onRemove]);

  const handleClose = () => {
    setFadeOut(true);
    setTimeout(() => onRemove(process.id), 300);
  };

  return (
    <Card 
      className={`processing-card ${fadeOut ? 'fade-out' : ''}`}
      style={{ borderLeftColor: statusConfig.color }}
      extra={
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={handleClose}
          size="small"
        />
      }
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <div className="processing-card-header">
          <Space>
            <span className="status-icon" style={{ color: statusConfig.color }}>
              {statusConfig.icon}
            </span>
            <div className="session-info">
              {/* <Text className="session-id">
                Session: {process.sessionId || 'Initializing...'}
              </Text> */}
              <Text className="strategy-name">
                {process.strategy || 'Unknown Strategy'}
              </Text>
            </div>
          </Space>
          <Text className="trade-symbol">{process.symbol}</Text>
        </div>
        
        <div className="processing-card-content">
          <div className="trade-info">
            <div className="trade-counts">
              <Text>Trades: {completedTrades}/{totalTrades}</Text>
              {process.tradeInfo.start_time && (
                <Text className="trade-time">
                  {formatDateTime(process.tradeInfo.start_time)} - {formatDateTime(process.tradeInfo.end_time)}
                </Text>
              )}
            </div>
            <div className="profit-info">
              <Text className="total-profit" style={{ 
                color: process.tradeInfo.total_profit >= 0 ? 'var(--success-color)' : 'var(--error-color)'
              }}>
                {process.tradeInfo.total_profit >= 0 ? '+' : ''}{process.tradeInfo.total_profit.toFixed(2)} USD
              </Text>
              <Text className="profit-details">
                Win: {process.tradeInfo.win_profit.toFixed(2)} | Loss: {process.tradeInfo.loss_profit.toFixed(2)}
              </Text>
            </div>
          </div>
          
          {process.error ? (
            <Text className="error-message">
              {process.error}
            </Text>
          ) : (
            <Progress 
              percent={progress}
              status={process.error ? 'exception' :
                     process.is_completed ? 'success' :
                     'active'}
              strokeColor={statusConfig.color}
              trailColor="var(--slider-rail-color)"
            />
          )}
        </div>
      </Space>
    </Card>
  );
}

interface ProcessingStackProps {
  processes: ProcessInfo[];
  onRemoveProcess?: (id: string) => void;
}

/**
 * ProcessingStack: Container component that renders a stack of processing cards for active trades.
 * Inputs: { processes: ProcessInfo[], onRemoveProcess?: (id: string) => void } - List of processes and optional removal callback
 * Output: JSX.Element | null - Stack of ProcessingCard components or null when no processes exist
 */
export default function ProcessingStack({ processes, onRemoveProcess }: ProcessingStackProps) {
  if (processes.length === 0) return null;

  const handleRemove = (id: string) => {
    onRemoveProcess?.(id);
  };

  return (
    <div className="processing-stack">
      {processes.map(process => (
        <ProcessingCard 
          key={process.id} 
          process={process}
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
}
