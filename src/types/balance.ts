import { SSEMessage } from './sse';

export interface BalanceData {
  balance: string;
  change: string;
  contract_id: string;
  currency: string;
  timestamp: string;
}

export interface BalanceMessage extends SSEMessage<BalanceData> {
  type: 'balance_update';
}

// Headers for external API calls that don't require authentication
export interface ExternalAPIHeaders extends Record<string, string> {
  // No required fields, can be empty or contain custom headers
}