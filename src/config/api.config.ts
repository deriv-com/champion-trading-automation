export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL,
  WS_URL: import.meta.env.VITE_WS_URL,
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
