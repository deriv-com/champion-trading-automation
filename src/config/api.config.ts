export const API_CONFIG = {
  BASE_URL: 'https://champion.mobile-bot.deriv.dev/',
  WS_URL: import.meta.env.VITE_WS_URL,
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
}

export const API_ENDPOINTS = {
  // Trading endpoints
  REPEAT_TRADE: '/champion/v1/repeat-trade',
  IS_TRADING: '/champion/v1/is-trading',
  STOP_TRADING: '/champion/v1/stop-trading',
  Threshold_Trade: '/champion/v1/threshold-trade',
  Martingale_Trade: '/champion/v1/martingale-trade',
  // WebSocket endpoint
  WS: '/champion/v1/ws',
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
