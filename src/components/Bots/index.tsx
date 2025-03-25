import React, { useState, useEffect, useCallback } from "react";
import {
  SearchOutlined,
  PlusOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import { Button, message } from "antd";
import { PageTitle } from "../PageTitle";
import { BotCard } from "./components/BotCard/index";
import { InputField } from "../InputField";
import "./styles.scss";
import { useNavigate } from "react-router-dom";
import { useBots, Bot } from "../../hooks/useBots";
import { useSSE } from "../../hooks/useSSE";
import { useRunningBots } from "../../hooks/useRunningBots";
import { StrategyDrawer } from "../StrategyDrawer";
import { Strategy } from "../../types/strategy";
import { SSEMessage, TradeUpdateMessage } from "../../types/sse";
import { API_ENDPOINTS } from "../../config/api.config";

/**
 * Bots: Displays a list of trading bots with search functionality.
 * Inputs: None
 * Output: JSX.Element - Component with bot cards, search functionality, and action buttons
 */
export function Bots() {
  const { 
    bots, 
    setBots, 
    getStoredBots, 
    deleteBot, 
    filterBots 
  } = useBots();

  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State for strategy drawer
  const [isStrategyDrawerOpen, setIsStrategyDrawerOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  
  // Use the running bots hook to persist running bots state
  const {
    runningBots,
    addRunningBot,
    removeRunningBot
  } = useRunningBots();
  
  // Handle SSE messages
  const handleSseMessage = useCallback((message: SSEMessage<TradeUpdateMessage>) => {
    console.log('SSE message received:', message);
    // Log detailed message structure for debugging
    console.log('Message type:', message.type);
    console.log('Message details:', JSON.stringify(message.data, null, 2));
    
    // Process the message to update running bots state
    if (message.type === 'trade_update') {
      const data = message.data;
      
      // Check if this is a bot status update
      if (data && data.session_id) {
        const sessionId = data.session_id;
        const isCompleted = data.is_completed;
        
        // Find the bot with this session ID
        const botEntry = Object.entries(runningBots).find(([_, sid]) => sid === sessionId);
        
        if (botEntry) {
          const [botId] = botEntry;
          
          // If the bot is completed, remove it from running bots
          if (isCompleted) {
            console.log(`Bot ${botId} with session ${sessionId} is now completed`);
            removeRunningBot(botId);
          }
        }
      }
    }
  }, [runningBots, removeRunningBot]);
  
  // Initialize SSE connection with default values
  const { isConnected, connect, disconnect } = useSSE<SSEMessage<TradeUpdateMessage>>({
    url: '',  // Will be set in useEffect
    headers: {
      'Authorization': '',  // Will be set in useEffect
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    onMessage: handleSseMessage,
    autoConnect: false // We'll connect manually when a bot starts running
  });
  
  // Set up SSE URL and headers and connect to SSE
  useEffect(() => {
    const setupSSE = async () => {
      try {
        // Import API config
        const { API_CONFIG } = await import('../../config/api.config');
        
        // Update the SSE URL and headers
        // Using the simplified SSE endpoint format
        const sseUrl = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.SSE}?account_uuid=${API_CONFIG.ACCOUNT_UUID}`;
        console.log('SSE URL configured:', sseUrl);
        
        // Connect to SSE to get updates about running bots
        if (!isConnected) {
          connect();
          console.log('SSE connected on component mount to track running bots');
        }
      } catch (error) {
        console.error('Error setting up SSE:', error);
      }
    };
    
    setupSSE();
    
    // Cleanup on unmount
    return () => {
      if (isConnected) {
        // We don't disconnect here because we want to keep the connection
        // even when navigating away from the page
        console.log('Keeping SSE connection active for bot status tracking');
      }
    };
  }, [connect, isConnected]);
  
  // Refresh bots list when component mounts or when returning from another page
  useEffect(() => {
    // Get the latest bots from localStorage
    const latestBots = getStoredBots();
    setBots(latestBots);
    
    // Cleanup SSE connection when component unmounts
    return () => {
      // Disconnect from the hook's SSE if connected
      if (isConnected) {
        disconnect();
        console.log('SSE hook disconnected on component unmount');
      }
    };
  }, [disconnect, isConnected]);


  const navigate = useNavigate();

  const handleAddBot = () => {
    navigate("/discover");
  };

  /**
   * handleSearchBot: Shows the search interface for filtering bots.
   * Inputs: None
   * Output: void - Sets searchVisible state to true
   */
  const handleSearchBot = () => {
    setSearchVisible(true);
    // Focus the search input after it becomes visible
    // No need to focus manually as we're using autoFocus
  };

  /**
   * handleCloseSearch: Closes the search interface and resets to the original bot list.
   * Inputs: None
   * Output: void - Resets search state and restores original bot list
   */
  const handleCloseSearch = () => {
    setSearchVisible(false);
    setSearchQuery("");
    setBots(getStoredBots());
  };

  /**
   * handleSearchChange: Updates the search query and filters bots accordingly.
   * Inputs: e: React.ChangeEvent<HTMLInputElement> - The change event
   * Output: void - Updates search query and filters bots
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setBots(getStoredBots());
    } else {
      const filteredBots = filterBots(query);
      setBots(filteredBots);
    }
  };

  /**
   * handleDeleteBot: Deletes a bot from the list.
   * Inputs: botId: string - ID of the bot to delete
   * Output: void - Removes the bot from the list
   */
  const handleDeleteBot = (botId: string) => {
    console.log(`Deleting bot ${botId}`);
    deleteBot(botId);
    // Refresh the bots list
    const updatedBots = getStoredBots();
    setBots(updatedBots);
  };

  /**
   * handleToggleBot: Handles the action of running or stopping a specific bot.
   * Inputs: botId: string - ID of the bot to run or stop
   * Output: void - Executes or stops the bot's trading strategy
   */
  const handleToggleBot = async (botId: string) => {
    // Check if the bot is already running
    const isRunning = !!runningBots[botId];
    
    try {
      // Find the bot by ID
      const bot = bots.find(b => b.id === botId);
      
      if (!bot) {
        console.error(`Bot with ID ${botId} not found`);
        return;
      }
      
      if (isRunning) {
        // Stop the bot
        await stopBot(botId);
      } else {
        // Start the bot
        await startBot(bot);
      }
    } catch (error) {
      console.error(`Error ${isRunning ? 'stopping' : 'starting'} bot:`, error);
      message.error(`Failed to ${isRunning ? 'stop' : 'start'} bot. Please try again.`);
    }
  };
  /**
   * createRequestPayload: Creates the appropriate request payload based on the strategy type
   * Inputs: bot: Bot - The bot to create the payload for, strategyType: TradeStrategy - The strategy type
   * Output: Object - The request payload for the strategy
   */
  /**
   * createRequestPayload: Creates the appropriate request payload based on the strategy type
   * Inputs:
   *   - bot: Bot - The bot to create the payload for
   *   - strategyType: string - The strategy type
   * Output: Promise<object> - The request payload for the strategy
   */
  const createRequestPayload = async (bot: Bot, strategyType: string): Promise<any> => {
    // Import API config
    const { API_CONFIG } = await import('../../config/api.config');
    
    // Get parameter values from the bot
    const getParamValue = (key: string, defaultValue: number): number => {
      const param = bot.params.find(p => p.key === key);
      return param ? param.value : defaultValue;
    };
    
    // Create payload based on strategy type, exactly matching Postman collection format
    switch (strategyType) {
      case 'martingale-trade':
        return {
          symbol: "frxUSDJPY",
          duration: 60,
          profit_threshold: getParamValue('profit_threshold', 50.0),
          loss_threshold: getParamValue('loss_threshold', 30.0),
          size: getParamValue('initial_stake', 10.0),
          max_stake: getParamValue('max_stake', 100.0),
          enable_max_stake: true,
          product_id: "rise_fall",
          proposal_details: {
            instrument_id: "frxUSDJPY",
            duration: 60,
            duration_unit: "seconds",
            allow_equals: true,
            stake: "10.00",
            variant: "rise",
            payout: "15.00"
          },
          payload: {}
        };
        
      case 'dalembert-trade':
        return {
          symbol: "frxUSDJPY",
          duration: 60,
          profit_threshold: getParamValue('profit_threshold', 50.0),
          loss_threshold: getParamValue('loss_threshold', 30.0),
          size: getParamValue('initial_stake', 1.0),
          unit: getParamValue('unit', 2.0),
          product_id: "rise_fall",
          proposal_details: {
            instrument_id: "frxUSDJPY",
            duration: 60,
            duration_unit: "seconds",
            allow_equals: true,
            stake: "1.00",
            variant: "rise",
            payout: "1.50"
          },
          payload: {}
        };
        
      case 'repeat-trade':
      default:
        return {
          product_id: "rise_fall",
          proposal_details: {
            instrument_id: "frxUSDJPY",
            duration: 60,
            duration_unit: "seconds",
            allow_equals: true,
            stake: "10.00",
            variant: "rise",
            payout: "15.00"
          },
          number_of_trades: getParamValue('number_of_trades', 3)
        };
    }
  };

  /**
   * startBot: Starts a bot with the specified bot object.
   * Inputs: bot: Bot - The bot to start
   * Output: Promise<void> - Resolves when the bot is started
   */
  const startBot = async (bot: Bot) => {
    console.log(`Starting bot ${bot.id}`);
    
    // Import the trade service
    const { tradeService } = await import('../../services/trade/tradeService');
    const { TradeStrategy } = await import('../../types/trade');
    
    // Import API config
    const { API_CONFIG } = await import('../../config/api.config');
    
    // Determine the strategy type based on the bot's strategyId or strategy name
    let strategyType: string;
    
    // Use the bot's strategyId if available, otherwise map the strategy name
    if (bot.strategyId) {
      strategyType = bot.strategyId;
    } else {
      // Map the bot's strategy to the corresponding strategy ID
      switch (bot.strategy.toLowerCase()) {
        case 'martingale':
          strategyType = 'martingale-trade';
          break;
        case 'd\'alembert':
        case 'dalembert':
          strategyType = 'dalembert-trade';
          break;
        default:
          strategyType = 'repeat-trade';
      }
    }
    
    // Construct the request payload based on the strategy type
    // Make sure to await the async function
    const requestPayload = await createRequestPayload(bot, strategyType);
    
    console.log('Bot execution started:', {
      requestPayload,
      strategyType
    });
    
    try {
      console.log('Executing bot with payload:', requestPayload);
      
      // Execute the trade using the appropriate strategy
      // Cast the string strategy type to any to avoid type errors
      const response = await tradeService.executeTrade(
        requestPayload,
        strategyType as any
      ) as { session_id: string };
      
      console.log('Bot execution successful:', response);
      
      // Extract the session_id from the response
      const sessionId = response.session_id;
      
      if (!sessionId) {
        throw new Error('No session ID returned from the API');
      }
      
      // Update the running bots state
      addRunningBot(bot.id, sessionId);
      
      // Connect to SSE if not already connected
      if (!isConnected) {
        try {
          // Extract account_uuid from the API response if available
          const responseData = response as any;
          
          // Use the account_uuid from the response, or from the API_CONFIG if not available
          // Make sure we're not using a placeholder value
          let accountUuid = responseData.account_uuid || API_CONFIG.ACCOUNT_UUID;
          
          // Use "dummy" as the account UUID if it's set to the placeholder value
          // This is because the backend is hardcoded to use "your_account_uuid"
          if (accountUuid === 'your_account_uuid') {
            console.log('Using "dummy" as account UUID since the backend is hardcoded to use "your_account_uuid"');
            accountUuid = 'your_account_uuid';
          }
          
          // Create SSE URL with the extracted account_uuid
          // Using the simplified SSE endpoint format
          const sseUrl = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.SSE}?account_uuid=${accountUuid}`;
          
          console.log('Creating SSE connection with URL:', sseUrl);
          
          // Connect to SSE using the hook
          connect();
          
          console.log('SSE connected, listening for messages...');
          
          // We don't need to create a direct EventSource connection as we're already using the hook
          // This prevents duplicate SSE connections
        } catch (error) {
          console.error('Error connecting to SSE:', error);
        }
      }
      
      message.success('Bot started successfully');
    } catch (error) {
      console.error('Error starting bot:', error);
      message.error('Failed to start bot. Please try again.');
      throw error;
    }
  };
  
  /**
   * stopBot: Stops a bot with the specified ID.
   * Inputs: botId: string - ID of the bot to stop
   * Output: Promise<void> - Resolves when the bot is stopped
   */
  const stopBot = async (botId: string) => {
    console.log(`Stopping bot ${botId}`);
    
    const sessionId = runningBots[botId];
    
    if (!sessionId) {
      console.error(`No session ID found for bot ${botId}`);
      return;
    }
    
    try {
      // Import axios for direct API call
      const axios = (await import('axios')).default;
      const { API_CONFIG } = await import('../../config/api.config');
      
      // Make direct API call to stop the bot
      // Using the simplified URL format without the champion_url parameter
      const response = await axios.post(
        // `${API_CONFIG.BASE_URL}/champion/v1/stop-trading/${sessionId}`,
        `https://champion.mobile-bot.deriv.dev/champion/v1/stop-trading/${sessionId}`,
        null,
        {
          params: {
            account_uuid: API_CONFIG.ACCOUNT_UUID
          },
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${API_CONFIG.CHAMPION_TOKEN}`
          }
        }
      );
      
      console.log('Bot stopped successfully:', response.data);
      
      // Remove the bot from the running bots state
      removeRunningBot(botId);
      
      // If there are no more running bots, disconnect from SSE
      if (Object.keys(runningBots).length === 1) { // Check for 1 since we just removed one but state hasn't updated yet
        // Disconnect from the hook's SSE if connected
        if (isConnected) {
          disconnect();
          console.log('SSE hook disconnected, no more running bots');
        }
      }
      
      message.success('Bot stopped successfully');
    } catch (error) {
      console.error('Error stopping bot:', error);
      message.error('Failed to stop bot. Please try again.');
      throw error;
    }
  };

  /**
   * handleEditBot: Opens the strategy drawer to edit a bot
   * Inputs: bot: Bot - The bot to edit
   * Output: void - Opens the strategy drawer with the bot's data
   */
  const handleEditBot = (bot: Bot) => {
    console.log(`Editing bot ${bot.name} (ID: ${bot.id})`);
    // Create a mock strategy object for the drawer
    // In a real app, you might fetch the actual strategy from an API
    const mockStrategy: Strategy = {
      id: "repeat-trade",  // Use a valid strategy ID from STRATEGY_PARAMS
      title: "Repeat Trade",
      description: "Configure repeat trade strategy",
    };
    
    setSelectedStrategy(mockStrategy);
    setSelectedBot(bot);
    setIsStrategyDrawerOpen(true);
  };

  const handleCloseStrategyDrawer = () => {
    // Close the drawer
    setIsStrategyDrawerOpen(false);
    setSelectedStrategy(null);
    setSelectedBot(null);
    
    // Refresh the bots list to show any updates
    const latestBots = getStoredBots();
    setBots(latestBots);
  };

  // Debug logs
  useEffect(() => {
    if (isStrategyDrawerOpen) {
      console.log("Strategy Drawer State:", {
        isOpen: isStrategyDrawerOpen,
        strategy: selectedStrategy,
        bot: selectedBot
      });
    }
  }, [isStrategyDrawerOpen, selectedStrategy, selectedBot]);

  return (
    <div className="bots-container">
      <div className="bots-header">
        <PageTitle title="Bots list" />
        <div className="bots-actions">
          <Button
            type="text"
            shape="circle"
            icon={<SearchOutlined />}
            className="bots-action-btn"
            onClick={handleSearchBot}
          />
          {bots.length > 0 && (
            <Button
              type="text"
              shape="circle"
              icon={<PlusOutlined />}
              className="bots-action-btn"
              onClick={handleAddBot}
            />
          )}
        </div>
      </div>

      {searchVisible && (
        <div className="search-overlay">
          <div className="search-container">
            <div className="search-input-wrapper">
              <InputField
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
                prefix={<SearchOutlined style={{ color: "#666" }} />}
                suffix={
                  searchQuery ? (
                    <CloseCircleFilled
                      style={{ color: "#999", cursor: "pointer" }}
                      onClick={() => {
                        setSearchQuery("");
                        setBots(getStoredBots());
                        // No need to focus manually as the input remains focused
                      }}
                    />
                  ) : null
                }
                autoFocus
              />
              <span className="search-cancel-btn" onClick={handleCloseSearch}>
                Cancel
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="bots-list">
        {bots.length > 0 ? (
          bots.map((bot: Bot) => (
            <BotCard
              key={bot.id}
              bot={bot}
              onRun={() => handleToggleBot(bot.id)}
              onDelete={() => handleDeleteBot(bot.id)}
              onEdit={() => handleEditBot(bot)}
              isRunning={!!runningBots[bot.id]}
            />
          ))
        ) : searchQuery.trim() !== "" ? (
          <div className="no-results">
            <h3 className="no-results-title">No results found</h3>
            <p className="no-results-subtitle">Try searching for something else.</p>
          </div>
        ) : (
          <div className="empty-bots" onClick={handleAddBot}>
            <div className="empty-bots-card">
              <Button type="text" shape="circle" icon={<PlusOutlined />} className="empty-bots-add-btn" />
              <div className="empty-bots-card-content">
                <h3 className="empty-bots-card-content-title">Create bot</h3>
                <p className="empty-bots-card-content-subtitle">Create bot to be added to the list and ready to run.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Strategy Drawer for editing bots */}
      {isStrategyDrawerOpen && selectedStrategy && selectedBot && (
        <StrategyDrawer
          strategy={selectedStrategy}
          onClose={handleCloseStrategyDrawer}
          editBot={selectedBot}
        />
      )}
    </div>
  );
}
