import { useState, useEffect } from 'react';

interface BotParam {
  key: string;
  label: string;
  value: number;
}

export interface Bot {
  id: string;
  name: string;
  market: string;
  tradeType: string;
  strategy: string;
  strategyId?: string;  // Optional strategy ID for API calls
  params: BotParam[];
}

/**
 * Custom hook for managing bots in localStorage
 * @returns Object with bots state and functions to manage bots
 */
export const useBots = () => {
  const [bots, setBots] = useState<Bot[]>([]);
  
  // Load bots from localStorage on initial render
  useEffect(() => {
    const storedBots = getStoredBots();
    setBots(storedBots);
  }, []);

  /**
   * Get bots from localStorage
   * @returns Array of bots from localStorage or empty array if none exist
   */
  const getStoredBots = (): Bot[] => {
    const storedBots = localStorage.getItem('bots');
    return storedBots ? JSON.parse(storedBots) : [];
  };

  /**
   * Save bots to localStorage
   * @param updatedBots Array of bots to save to localStorage
   */
  const updateLocalStorage = (updatedBots: Bot[]) => {
    localStorage.setItem('bots', JSON.stringify(updatedBots));
    setBots(updatedBots);
  };

  /**
   * Add a new bot to the list
   * @param bot Bot object to add
   */
  const addBot = (bot: Bot) => {
    const updatedBots = [...bots, bot];
    updateLocalStorage(updatedBots);
  };

  /**
   * Delete a bot from the list
   * @param botId ID of the bot to delete
   */
  const deleteBot = (botId: string) => {
    const updatedBots = bots.filter(bot => bot.id !== botId);
    updateLocalStorage(updatedBots);
  };

  /**
   * Filter bots based on search query
   * @param query Search query to filter bots by
   * @returns Filtered array of bots
   */
  const filterBots = (query: string): Bot[] => {
    if (!query.trim()) {
      return getStoredBots();
    }
    
    const lowercaseQuery = query.toLowerCase();
    return getStoredBots().filter(
      (bot) =>
        bot.name.toLowerCase().includes(lowercaseQuery) ||
        bot.market.toLowerCase().includes(lowercaseQuery) ||
        bot.strategy.toLowerCase().includes(lowercaseQuery)
    );
  };

  /**
   * Update an existing bot in the list
   * @param updatedBot Bot object with updated values
   */
  const updateBot = (updatedBot: Bot) => {
    const updatedBots = bots.map(bot => 
      bot.id === updatedBot.id ? updatedBot : bot
    );
    updateLocalStorage(updatedBots);
  };

  return {
    bots,
    setBots,
    getStoredBots,
    updateLocalStorage,
    addBot,
    deleteBot,
    updateBot,
    filterBots
  };
};
