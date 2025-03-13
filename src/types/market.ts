export interface MarketInfo {
    symbol: string
    displayName: string
    shortName: string
    market_name: string
    type: "volatility" | "boom" | "crash"
    isClosed?: boolean
  }
  
  // Market display titles
  export const marketTitles: Record<string, string> = {
    synthetic_index: "Synthetics",
    crash_boom: "Crash/Boom",
    forex: "Forex",
  }
  
  // Market type mapping for tabs
  export const marketTypeMap: Record<string, string> = {
    derived: "synthetic_index",
    forex: "forex",
    crash_boom: "crash_boom",
  }
  
  export const marketData: MarketInfo[] = [
    // Synthetic Indices
    {
      symbol: "R_100",
      displayName: "Volatility 100 Index",
      shortName: "100",
      market_name: "synthetic_index",
      type: "volatility"
    },
    {
      symbol: "R_75",
      displayName: "Volatility 75 Index",
      shortName: "75",
      market_name: "synthetic_index",
      type: "volatility"
    },
    {
      symbol: "R_50",
      displayName: "Volatility 50 Index",
      shortName: "50",
      market_name: "synthetic_index",
      type: "volatility"
    },
    {
      symbol: "R_25",
      displayName: "Volatility 25 Index",
      shortName: "25",
      market_name: "synthetic_index",
      type: "volatility"
    },
    {
      symbol: "R_10",
      displayName: "Volatility 10 Index",
      shortName: "10",
      market_name: "synthetic_index",
      type: "volatility"
    },
    {
      symbol: "1HZ100V",
      displayName: "Volatility 100 (1s) Index",
      shortName: "100",
      market_name: "synthetic_index",
      type: "volatility"
    },
    {
      symbol: "1HZ75V",
      displayName: "Volatility 75 (1s) Index",
      shortName: "75",
      market_name: "synthetic_index",
      type: "volatility"
    },
    {
      symbol: "1HZ50V",
      displayName: "Volatility 50 (1s) Index",
      shortName: "50",
      market_name: "synthetic_index",
      type: "volatility"
    },
    
    // Crash/Boom
    {
      symbol: "BOOM1000",
      displayName: "Boom 1000 Index",
      shortName: "1000",
      market_name: "crash_boom",
      type: "boom"
    },
    {
      symbol: "BOOM500",
      displayName: "Boom 500 Index",
      shortName: "500",
      market_name: "crash_boom",
      type: "boom"
    },
    {
      symbol: "CRASH1000",
      displayName: "Crash 1000 Index",
      shortName: "1000",
      market_name: "crash_boom",
      type: "crash"
    },
    {
      symbol: "CRASH500",
      displayName: "Crash 500 Index",
      shortName: "500",
      market_name: "crash_boom",
      type: "crash"
    },
    
    // Forex
    {
      symbol: "frxEURUSD",
      displayName: "EUR/USD",
      shortName: "EUR",
      market_name: "forex",
      type: "volatility"
    },
    {
      symbol: "frxGBPUSD",
      displayName: "GBP/USD",
      shortName: "GBP",
      market_name: "forex",
      type: "volatility"
    },
    {
      symbol: "frxUSDJPY",
      displayName: "USD/JPY",
      shortName: "USD",
      market_name: "forex",
      type: "volatility",
      isClosed: true
    },
    {
      symbol: "frxAUDUSD",
      displayName: "AUD/USD",
      shortName: "AUD",
      market_name: "forex",
      type: "volatility"
    },
    {
      symbol: "frxUSDCAD",
      displayName: "USD/CAD",
      shortName: "USD",
      market_name: "forex",
      type: "volatility"
    },
    {
      symbol: "frxUSDCHF",
      displayName: "USD/CHF",
      shortName: "USD",
      market_name: "forex",
      type: "volatility"
    },
    {
      symbol: "frxEURGBP",
      displayName: "EUR/GBP",
      shortName: "EUR",
      market_name: "forex",
      type: "volatility"
    }
  ]
  