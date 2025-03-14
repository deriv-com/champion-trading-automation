import React, { useState, useRef, useEffect } from "react";
import {
  SearchOutlined,
  PlusOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import { Button } from "antd";
import { PageTitle } from "../PageTitle";
import { BotCard } from "./components/BotCard/index";
import { InputField } from "../InputField";
import "./styles.scss";
import { useNavigate } from "react-router-dom";
import { useBots, Bot } from "../../hooks/useBots";
import { StrategyDrawer } from "../StrategyDrawer";
import { Strategy } from "../../types/strategy";
import { useNotification } from "../../contexts/NotificationContext";

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
  const { showSimpleNotification } = useNotification();

  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLDivElement>(null);
  
  // State for strategy drawer
  const [isStrategyDrawerOpen, setIsStrategyDrawerOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  
  // Refresh bots list when component mounts or when returning from another page
  useEffect(() => {
    // Get the latest bots from localStorage
    const latestBots = getStoredBots();
    setBots(latestBots);
  }, []);

  /**
   * handleRunBot: Handles the action of running a specific bot.
   * Inputs: botId: string - ID of the bot to run
   * Output: void - Currently logs the action and bot ID to console
   */
  const handleRunBot = (botId: string) => {
    console.log(`Running bot ${botId}`);
    // Implement bot running logic here
    
    // Find the bot to get its name
    const botToRun = bots.find(bot => bot.id === botId);
    const botName = botToRun ? botToRun.name : 'Bot';
    
    // Show simple notification with the new design
    showSimpleNotification(`${botName} is now running.`);
  };

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
   * handleSearchChange: Filters the bot list based on search query text.
   * Inputs: e: React.ChangeEvent<HTMLInputElement> - Input change event
   * Output: void - Updates searchQuery state and filters bot list
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setBots(getStoredBots());
      return;
    }
    
    // Filter bots based on search query
    const filteredBots = filterBots(query);

    if (filteredBots.length === 0 && query.trim() !== "") {
      // Show "No results found" message
      setBots([]);
    } else if (filteredBots.length > 0) {
      // Show filtered results
      setBots(filteredBots);
    } else {
      // Show all bots if no query or no results
      setBots(getStoredBots());
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchVisible &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(".search-cancel-btn")
      ) {
        handleCloseSearch();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchVisible]);

  const handleDeleteBot = (botId: string) => {
    // Find the bot to get its name before deleting
    const botToDelete = bots.find(bot => bot.id === botId);
    const botName = botToDelete ? botToDelete.name : 'Bot';
    
    // Delete the bot
    deleteBot(botId);
    
    // Show simple notification with the new design
    showSimpleNotification(`${botName} has been deleted.`);
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
              onRun={() => handleRunBot(bot.id)}
              onDelete={() => handleDeleteBot(bot.id)}
              onEdit={() => handleEditBot(bot)}
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
