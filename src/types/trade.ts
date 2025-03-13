import { FormValues } from "./form";

// Trade request types
export interface CommonTradeParams extends FormValues {
  proposal: 1;
  basis: 'stake' | 'payout';
  contract_type?: ContractType,
  currency?: string,
  amount: number;
  symbol: string;
  growth_rate: number;
}

export interface RepeatTradeRequest extends CommonTradeParams {
  number_of_trades: number;
  limit_order?: {
    take_profit: number;
  };
}

export interface ThresholdTradeRequest extends CommonTradeParams {
  duration: number;
  profit_threshold: number;
  loss_threshold: number;
}

export interface MartingaleTradeRequest extends CommonTradeParams {
  multiplier: number;
  max_steps: number;
  profit_threshold: number;
  loss_threshold: number;
}

// Trade status types
export interface TradeContract {
  buy_id: string;
  contract_id: string;
  profit: number;
}

export interface TradeInfo {
  contracts: TradeContract[];
  duration: number;
  end_time: string;
  initial: number;
  loss_profit: number;
  loss_threshold: number;
  number_of_trade: number;
  profit_threshold: number;
  session_id: string;
  start_time: string;
  strategy: string;
  total_profit: number;
  win_profit: number;
}

export interface TradeStatus {
  tradeinfo_list: TradeInfo[];
}

// Error types
export interface TradeError {
  error: string;
}

// Trade status enums
export enum TradeStatusEnum {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ERROR = 'error'
}

// Contract types
export enum ContractType {
  ACCUMULATOR = 'ACCU',
  CALL = 'CALL',
  PUT = 'PUT'
}

// Trade strategy types
export enum TradeStrategy {
  REPEAT = 'repeat-trade',
  MARTINGALE = 'martingale-trade',
  THRESHOLD = 'threshold-trade'
}
