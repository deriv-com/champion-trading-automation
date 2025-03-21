/**
 * @file: balanceService.ts
 * @description: Service for managing user balance data, including fetching,
 *               formatting, and calculating balance changes.
 *
 * @components:
 *   - BalanceService class: Service with balance-related functionality
 *   - balanceService export: Instance of the service
 * @dependencies:
 *   - types/balance: BalanceData and ExternalAPIHeaders types
 *   - config/api.config: API configuration and endpoints
 *   - services/api/apiService: Core API service for HTTP requests
 * @usage:
 *   // Fetch initial balance
 *   const balance = await balanceService.fetchInitialBalance();
 *
 *   // Format balance for display
 *   const formatted = balanceService.formatBalance('1234.56'); // Returns '1,234.56'
 *
 * @architecture: Service module with utility methods
 * @relationships:
 *   - Used by: BalanceContext, components displaying balance
 *   - Related to: balanceStreamService for real-time updates
 * @dataFlow:
 *   - Fetches balance data from API
 *   - Formats and processes balance information
 *   - Provides utilities for balance change calculations
 *
 * @ai-hints: This service handles both initial balance fetching and various
 *            formatting/calculation utilities for balance display. It includes
 *            error handling and fallback values for robustness.
 */
import { BalanceData, ExternalAPIHeaders } from '../../types/balance';
import { API_ENDPOINTS } from '../../config/api.config';
import { apiService } from '../api/apiService';

/**
 * Interface for the initial balance response from the API
 */
interface InitialBalanceResponse {
  data: {
    balance: string;
    currency: string;
  };
  meta: {
    endpoint: string;
    method: string;
    timing: number;
  };
}

/**
 * Balance Service: Provides methods for working with balance data
 */
class BalanceService {
  /**
   * Fetch initial balance from the static endpoint
   * @returns Promise with the balance data
   */
  async fetchInitialBalance(): Promise<BalanceData> {
    try {
      const fullUrl = `https://mock.mobile-bot.deriv.dev/${API_ENDPOINTS.BALANCE}`;
      const headers: ExternalAPIHeaders = {};
      
      const data: InitialBalanceResponse = await apiService.get<InitialBalanceResponse>(
        fullUrl,
        {}, // No query params
        headers
      );
      
      if (!data || !data.data || !data.data.balance) {
        throw new Error('Invalid response format');
      }
      
      // Convert to BalanceData format
      const balanceData: BalanceData = {
        balance: data.data.balance,
        change: '0.00',
        contract_id: '',
        currency: data.data.currency,
        timestamp: new Date().toISOString()
      };
      
      return balanceData;
    } catch (error) {
      console.error('BalanceService: Error fetching initial balance:', error);
      // Return default balance data on error
      return {
        balance: '0.00',
        change: '0.00',
        contract_id: '',
        currency: 'USD',
        timestamp: new Date().toISOString()
      };
    }
  }
  /**
   * Format balance for display
   * @param balance - Raw balance string
   * @returns Formatted balance string with commas
   */
  formatBalance(balance: string): string {
    if (!balance) {
      return '0.00';
    }
    
    try {
      // Parse the balance to a number
      const numBalance = parseFloat(balance);
      
      if (isNaN(numBalance)) {
        return '0.00';
      }
      
      // Format with commas and 2 decimal places
      const formatted = numBalance.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      
      return formatted;
    } catch (error) {
      console.error('BalanceService: Error formatting balance:', error);
      return '0.00';
    }
  }

  /**
   * Get the balance stream URL from config
   * @returns The configured balance stream URL
   */
  getBalanceStreamUrl(): string {
    return `https://mock.mobile-bot.deriv.dev/${API_ENDPOINTS.BALANCE_STREAM}`;
  }

  /**
   * Calculate the difference between two balance values
   * @param currentBalance - Current balance value
   * @param previousBalance - Previous balance value
   * @returns Difference as a string with sign
   */
  calculateBalanceDifference(currentBalance: string, previousBalance: string): string {
    if (!currentBalance || !previousBalance) return '0.00';
    
    const current = parseFloat(currentBalance);
    const previous = parseFloat(previousBalance);
    const difference = current - previous;
    
    // Format with sign and 2 decimal places
    return difference.toFixed(2);
  }

  /**
   * Determine if a balance change is positive, negative, or neutral
   * @param change - Balance change value
   * @returns 'positive', 'negative', or 'neutral'
   */
  getBalanceChangeType(change: string): 'positive' | 'negative' | 'neutral' {
    if (!change) return 'neutral';
    
    const changeValue = parseFloat(change);
    
    if (changeValue > 0) return 'positive';
    if (changeValue < 0) return 'negative';
    return 'neutral';
  }

  /**
   * Format a timestamp for display
   * @param timestamp - ISO timestamp string
   * @returns Formatted time string
   */
  formatTimestamp(timestamp: string): string {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString();
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '';
    }
  }
}

export const balanceService = new BalanceService();