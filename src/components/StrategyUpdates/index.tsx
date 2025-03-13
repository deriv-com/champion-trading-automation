import React from 'react';
import { useSSEContext } from '../../contexts/SSEContext';
import './styles.scss';

export const StrategyUpdates: React.FC = () => {
  const { isConnected, connectionTime, error } = useSSEContext();

  return (
    <div className="strategy-updates">
      <h3>SSE Connection Status</h3>
      <div className={`connection-status ${error ? 'error' : ''}`}>
        <div className="status-row">
          <span 
            className="status-text"
            data-connected={isConnected}
          >
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          {isConnected && connectionTime && (
            <span className="connected-time">
              {connectionTime.toLocaleTimeString()}
            </span>
          )}
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};
