/**
 * @file: trade.ts
 * @description: Type definitions for trading functionality, including trade requests,
 *               trade status tracking, contract types, and trading strategies.
 *
 * @components:
 *   - Interfaces: CommonTradeParams, RepeatTradeRequest, ThresholdTradeRequest,
 *                MartingaleTradeRequest, TradeContract, TradeInfo, TradeStatus, TradeError
 *   - Enums: TradeStatusEnum, ContractType, TradeStrategy
 * @dependencies:
 *   - form.ts: FormValues type for form data integration
 * @usage:
 *   // Creating a trade request
 *   const request: RepeatTradeRequest = {
 *     proposal: 1,
 *     basis: 'stake',
 *     amount: 100,
 *     symbol: 'EURUSD',
 *     growth_rate: 0.05,
 *     number_of_trades: 5
 *   };
 *
 * @architecture: Type hierarchy with common base types and specialized extensions
 * @relationships:
 *   - Used by: Trading services, components, and forms
 *   - Extends: FormValues from form.ts
 * @dataFlow: These types define the structure of data flowing through the trading system
 *
 * @ai-hints: The trading system supports three main strategy types: Repeat, Threshold,
 *            and Martingale, each with their own specific parameters extending from
 *            the CommonTradeParams base interface.
 */
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
  contracts?: TradeContract[];
  duration: number;
  end_time: string;
  initial: number;
  loss_profit: number;
  loss_threshold?: number;
  number_of_trade: number;
  profit_threshold?: number;
  session_id: string;
  start_time: string;
  strategy: string;
  total_profit: number;
  win_profit: number;
  // Additional fields from API response
  is_completed?: boolean;
  status?: string;
}

export interface TradeStatus {
  tradeinfo_list?: TradeInfo[];
  sessions?: TradeInfo[];
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
  REPEAT = 'repeat_trade',
  MARTINGALE = 'martingale_trade',
  THRESHOLD = 'threshold_trade'
}
