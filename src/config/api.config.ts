/**
 * @file: api.config.ts
 * @description: Configuration constants for API endpoints, WebSocket connections,
 *               and event types used throughout the application.
 *
 * @components:
 *   - API_CONFIG: Core API configuration settings
 *   - API_ENDPOINTS: API endpoint paths
 *   - WS_EVENTS: WebSocket event type constants
 * @dependencies:
 *   - Vite environment variables (import.meta.env)
 * @usage:
 *   // Access API configuration
 *   import { API_CONFIG, API_ENDPOINTS } from '../config/api.config';
 *
 *   const apiUrl = API_CONFIG.BASE_URL + API_ENDPOINTS.BALANCE;
 *   const timeout = API_CONFIG.TIMEOUT;
 *
 * @architecture: Constants module pattern
 * @relationships:
 *   - Used by: API services, WebSocket services, SSE services
 *   - Related to: Environment configuration (.env files)
 * @dataFlow: Provides configuration constants to services that interact with APIs
 *
 * @ai-hints: This file centralizes all API-related configuration to avoid
 *            hardcoded values throughout the codebase. Environment variables
 *            are accessed through Vite's import.meta.env.
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://champion.mobile-bot.deriv.dev',
  WS_URL: import.meta.env.VITE_WS_URL,
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  // Champion API specific configuration
  CHAMPION_TOKEN: import.meta.env.VITE_CHAMPION_TOKEN || 'champion_trading_automation',
  ACCOUNT_UUID: import.meta.env.VITE_ACCOUNT_UUID || 'account_uuid',
  CHAMPION_API_URL: import.meta.env.VITE_CHAMPION_API_URL || 'http://mobile-backend-service-mock-gray:3000',
}

export const API_ENDPOINTS = {
  // Trading endpoints
  REPEAT_TRADE: '/champion/v1/repeat-trade',
  IS_TRADING: '/champion/v1/is-trading',
  STOP_TRADING: '/champion/v1/stop-trading',
  STRATEGIES: '/champion/v1/strategies',
  DALEMBERT_TRADE: '/champion/v1/dalembert-trade',    // Changed from Threshold_Trade and updated path
  MARTINGALE_TRADE: '/champion/v1/martingale-trade',  // Changed from Martingale_Trade
  // WebSocket and SSE endpoints
  WS: '/champion/v1/ws',
  SSE: '/champion/v1/sse',
  BALANCE_STREAM: '/v1/accounting/balance/stream',
  BALANCE: '/v1/accounting/balance',
}

export const WS_EVENTS = {
  // Define your WebSocket events here
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  MESSAGE: 'message',
  // Trading specific events
  TRADE_UPDATE: 'trade_update',
  TRADE_COMPLETE: 'trade_complete',
  TRADE_ERROR: 'trade_error',
}
