import { apiService } from '../api/apiService';
import { API_CONFIG, API_ENDPOINTS } from '../../config/api.config';
import {
  TradeStatus,
  TradeStrategy
} from '../../types/trade';
import { authStore } from '../../stores/authStore';

/**
 * TradeService: Service for executing trading operations with different strategies.
 * Implements singleton pattern and provides retry mechanism for API calls.
 * Methods: executeTrade, checkTradeStatus, stopTrading
 */
class TradeService {
  private static instance: TradeService;
  private retryAttempts: number = API_CONFIG.RETRY_ATTEMPTS;

  private constructor() {}

  /**
   * getInstance: Returns the singleton instance of TradeService.
   * Inputs: None
   * Output: TradeService - Singleton instance of the service
   */
  public static getInstance(): TradeService {
    if (!TradeService.instance) {
      TradeService.instance = new TradeService();
    }
    return TradeService.instance;
  }

  /**
   * executeTrade: Executes a trading session with the specified strategy.
   * Inputs:
   *   - request: TRequest - The trade request parameters
   *   - strategy: TradeStrategy | string - The trading strategy to use (can be enum value or string ID)
   * Output: Promise<TResponse> - Promise with the trade response
   * Throws: TradeError if the request fails
   */
  public async executeTrade<TRequest extends object, TResponse>(
    request: TRequest,
    strategy: TradeStrategy | string
  ): Promise<TResponse> {
    const headers = authStore.getHeaders();

    // Get the appropriate endpoint based on the strategy
    const endpoint = this.getStrategyEndpoint(strategy);
    
    console.log(`Executing trade with strategy: ${strategy}`);
    console.log(`Using endpoint: ${endpoint}`);
    console.log(`Request payload:`, request);

    // Add query parameters for account_uuid and champion_url
    const params = {
      account_uuid: API_CONFIG.ACCOUNT_UUID,
      champion_url: API_CONFIG.CHAMPION_API_URL
    };

    return await this.retryOperation(() =>
      apiService.post<TResponse>(
        endpoint,
        request,
        headers,
        params  // Pass query parameters
      )
    );
  }

  /**
   * getStrategyEndpoint: Gets the API endpoint for a given strategy.
   * Inputs: strategy: TradeStrategy | string - The trading strategy (can be enum value or string ID)
   * Output: string - The corresponding API endpoint
   * Throws: Error if strategy is not supported
   */
  private getStrategyEndpoint(strategy: TradeStrategy | string): string {
    // Handle both enum values and string values
    if (typeof strategy === 'string') {
      switch (strategy) {
        case 'repeat-trade':
          return API_ENDPOINTS.REPEAT_TRADE;
        case 'martingale-trade':
          return API_ENDPOINTS.MARTINGALE_TRADE;
        case 'dalembert-trade':
          return API_ENDPOINTS.DALEMBERT_TRADE;
        default:
          throw new Error(`Unsupported strategy: ${strategy}`);
      }
    } else {
      // Handle enum values
      switch (strategy) {
        case TradeStrategy.REPEAT:
          return API_ENDPOINTS.REPEAT_TRADE;
        case TradeStrategy.MARTINGALE:
          return API_ENDPOINTS.MARTINGALE_TRADE;
        case TradeStrategy.DALEMBERT:
          return API_ENDPOINTS.DALEMBERT_TRADE;
        default:
          throw new Error(`Unsupported strategy: ${strategy}`);
      }
    }
  }

  /**
   * checkTradeStatus: Checks the status of all trading sessions.
   * Inputs: None
   * Output: Promise<TradeStatus> - Promise with the trade status
   * Throws: TradeError if the request fails
   */
  public async checkTradeStatus(): Promise<TradeStatus> {
    const headers = authStore.getHeaders();

    return await this.retryOperation(() =>
      apiService.get<TradeStatus>(
        API_ENDPOINTS.IS_TRADING,
        undefined,
        headers
      )
    );
  }

  /**
   * stopTrading: Stops an active trading session.
   * Inputs: symbol: string - The trading symbol to stop
   * Output: Promise<void> - Promise that resolves when trading is stopped
   * Throws: TradeError if the request fails
   */
  public async stopTrading(symbol: string): Promise<void> {
    const headers = authStore.getHeaders();

    await this.retryOperation(() =>
      apiService.post<void>(
        `${API_ENDPOINTS.STOP_TRADING}/${symbol}`,
        undefined,
        headers
      )
    );
  }

  /**
   * retryOperation: Generic retry operation for API calls with exponential backoff.
   * Inputs: operation: () => Promise<T> - The async operation to retry
   * Output: Promise<T> - Promise with the operation result
   * Throws: Error with details after all retry attempts fail
   */
  private async retryOperation<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        console.error(`Attempt ${attempt} failed:`, error);
        
        // Don't wait on the last attempt
        if (attempt === this.retryAttempts) break;
        
        // Exponential backoff: wait longer between each retry
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // If we get here, all retries failed
    throw new Error(
      `Operation failed after ${this.retryAttempts} attempts. Last error: ${lastError?.message}`
    );
  }
}

// Export singleton instance
export const tradeService = TradeService.getInstance();
