import React, { useState, useRef, useEffect } from "react";
import {
  SearchOutlined,
  PlusOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import { StandaloneSearchFillIcon } from "@deriv/quill-icons";
import { Button } from "antd";
import { PageTitle } from "../PageTitle";
import { BotCard } from "./components/BotCard/index";
import { InputField } from "../InputField";
import { SlideDrawer } from "../SlideDrawer";
import { StrategyList } from "../StrategyList";
import "./styles.scss";

// Mock data for demonstration
const mockBots = [
  {
    id: "1",
    name: "Martingale acc test",
    market: "Volatility 100 (1s) Index",
    tradeType: "Rise/Fall",
    strategy: "Repeat",
    params: [
      { key: "repeat_trade", label: "Repeat trade", value: 2 },
      { key: "initial_stake", label: "Initial stake", value: "10.00" },
      { key: "take_profit", label: "Take profit", value: "100.00" },
      { key: "stop_loss", label: "Stop loss", value: "50.00" },
    ],
  },
  {
    id: "2",
    name: "Martingale acc test",
    market: "Volatility 100 (1s) Index",
    tradeType: "Rise/Fall",
    strategy: "Repeat",
    params: [
      { key: "repeat_trade", label: "Repeat trade", value: 3 },
      { key: "initial_stake", label: "Initial stake", value: "15.00" },
    ],
  },
  {
    id: "3",
    name: "Martingale acc test",
    market: "Volatility 100 (1s) Index",
    tradeType: "Rise/Fall",
    strategy: "Martingale",
    params: [
      { key: "repeat_trade", label: "Repeat trade", value: 2 },
      { key: "initial_stake", label: "Initial stake", value: "10.00" },
      { key: "multiplier", label: "Multiplier", value: 2.5 },
    ],
  },
  {
    id: "4",
    name: "Martingale acc test",
    market: "Volatility 100 (1s) Index",
    tradeType: "Rise/Fall",
    strategy: "D'Alembert",
    params: [
      { key: "repeat_trade", label: "Repeat trade", value: 2 },
      { key: "initial_stake", label: "Initial stake", value: "10.00" },
      { key: "step_size", label: "Step size", value: "5.00" },
    ],
  },
  {
    id: "5",
    name: "Martingale acc test",
    market: "Volatility 100 (1s) Index",
    tradeType: "Rise/Fall",
    strategy: "Oscar's Grind",
    params: [
      { key: "repeat_trade", label: "Repeat trade", value: 2 },
      { key: "initial_stake", label: "Initial stake", value: "10.00" },
      { key: "step_size", label: "Step size", value: "1.00" },
      { key: "target_profit", label: "Target profit", value: "20.00" },
    ],
  },
  {
    id: "6",
    name: "Martingale acc test",
    market: "Volatility 100 (1s) Index",
    tradeType: "Rise/Fall",
    strategy: "Fibonacci",
    params: [
      { key: "repeat_trade", label: "Repeat trade", value: 2 },
      { key: "initial_stake", label: "Initial stake", value: "10.00" },
      { key: "max_level", label: "Max level", value: 5 },
    ],
  },
];

/**
 * Bots: Displays a list of trading bots with search functionality.
 * Inputs: None
 * Output: JSX.Element - Component with bot cards, search functionality, and action buttons
 */
export function Bots() {
  const [bots, setBots] = useState(mockBots);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isStrategyDrawerOpen, setIsStrategyDrawerOpen] = useState(false);
  const searchInputRef = useRef<HTMLDivElement>(null);

  /**
   * handleRunBot: Handles the action of running a specific bot.
   * Inputs: botId: string - ID of the bot to run
   * Output: void - Currently logs the action and bot ID to console
   */
  const handleRunBot = (botId: string) => {
    console.log(`Running bot ${botId}`);
    // Implement bot running logic here
  };

  /**
   * handleAddBot: Handles the action of adding a new bot.
   * Inputs: None
   * Output: void - Currently logs the action to console
   */
  const handleAddBot = () => {
    setIsStrategyDrawerOpen(true);
  };

  const handleCloseStrategyDrawer = () => {
    setIsStrategyDrawerOpen(false);
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
    setBots(mockBots); // Reset to original bots
  };

  /**
   * handleSearchChange: Filters the bot list based on search query text.
   * Inputs: e: React.ChangeEvent<HTMLInputElement> - Input change event
   * Output: void - Updates searchQuery state and filters bot list
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setBots(mockBots);
      return;
    }

    // Filter bots based on search query
    const filteredBots = mockBots.filter(
      (bot) =>
        bot.name.toLowerCase().includes(query.toLowerCase()) ||
        bot.market.toLowerCase().includes(query.toLowerCase()) ||
        bot.strategy.toLowerCase().includes(query.toLowerCase())
    );

    setBots(filteredBots);
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
          <Button
            type="text"
            shape="circle"
            icon={<PlusOutlined />}
            className="bots-action-btn"
            onClick={handleAddBot}
          />
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
                        setBots(mockBots);
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
          bots.map((bot) => (
            <BotCard
              key={bot.id}
              bot={bot}
              onRun={() => handleRunBot(bot.id)}
            />
          ))
        ) : (
          <div className="no-results">
            <div className="no-results-icon">
              <StandaloneSearchFillIcon fill="#181C253D" iconSize='2xl'/>
            </div>
            <h3 className="no-results-title">No results for {searchQuery}</h3>
            <p className="no-results-subtitle">
              Try searching for something else.
            </p>
          </div>
        )}
      </div>

      <SlideDrawer
        isOpen={isStrategyDrawerOpen}
        onClose={handleCloseStrategyDrawer}
        placement="right"
      >
        <StrategyList />
      </SlideDrawer>
    </div>
  );
}
