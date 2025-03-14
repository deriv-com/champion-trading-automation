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
  BASE_URL: import.meta.env.VITE_API_URL,
  WS_URL: import.meta.env.VITE_WS_URL,
  EXTERNAL_API_BASE_URL: import.meta.env.VITE_EXTERNAL_API_BASE_URL,
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
}

export const API_ENDPOINTS = {
  // Trading endpoints
  REPEAT_TRADE: '/api/v2/repeat-trade',
  IS_TRADING: '/api/v2/is-trading',
  STOP_TRADING: '/api/v2/stop-trading',
  Threshold_Trade: '/api/v2/threshold-trade',
  Martingale_Trade: '/api/v2/martingale-trade',
  // WebSocket endpoint
  WS: '/ws',
  // SSE endpoints
  BALANCE_STREAM: '/accounting/balance/stream',
  // Balance endpoints
  BALANCE: '/accounting/balance',
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
