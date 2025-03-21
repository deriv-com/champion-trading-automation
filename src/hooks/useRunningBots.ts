import { useState, useEffect } from 'react';

/**
 * Custom hook for managing running bots in localStorage
 * @returns Object with running bots state and functions to manage running bots
 */
export const useRunningBots = () => {
  const [runningBots, setRunningBots] = useState<Record<string, string>>({});
  
  // Load running bots from localStorage on initial render
  useEffect(() => {
    const storedRunningBots = getStoredRunningBots();
    setRunningBots(storedRunningBots);
  }, []);

  /**
   * Get running bots from localStorage
   * @returns Record of bot IDs to session IDs from localStorage or empty object if none exist
   */
  const getStoredRunningBots = (): Record<string, string> => {
    const storedRunningBots = localStorage.getItem('runningBots');
    return storedRunningBots ? JSON.parse(storedRunningBots) : {};
  };

  /**
   * Save running bots to localStorage
   * @param updatedRunningBots Record of bot IDs to session IDs to save to localStorage
   */
  const updateLocalStorage = (updatedRunningBots: Record<string, string>) => {
    localStorage.setItem('runningBots', JSON.stringify(updatedRunningBots));
    setRunningBots(updatedRunningBots);
  };

  /**
   * Add a running bot to the list
   * @param botId ID of the bot that is running
   * @param sessionId Session ID of the running bot
   */
  const addRunningBot = (botId: string, sessionId: string) => {
    const updatedRunningBots = { ...runningBots, [botId]: sessionId };
    updateLocalStorage(updatedRunningBots);
  };

  /**
   * Remove a running bot from the list
   * @param botId ID of the bot to remove from running bots
   */
  const removeRunningBot = (botId: string) => {
    const updatedRunningBots = { ...runningBots };
    delete updatedRunningBots[botId];
    updateLocalStorage(updatedRunningBots);
  };

  /**
   * Check if a bot is running
   * @param botId ID of the bot to check
   * @returns True if the bot is running, false otherwise
   */
  const isBotRunning = (botId: string): boolean => {
    return !!runningBots[botId];
  };

  /**
   * Get the session ID of a running bot
   * @param botId ID of the bot to get the session ID for
   * @returns Session ID of the running bot or undefined if not running
   */
  const getSessionId = (botId: string): string | undefined => {
    return runningBots[botId];
  };

  return {
    runningBots,
    setRunningBots,
    getStoredRunningBots,
    updateLocalStorage,
    addRunningBot,
    removeRunningBot,
    isBotRunning,
    getSessionId
  };
};