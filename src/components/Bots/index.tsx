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
import { useNavigate } from "react-router-dom";

const getStoredBots = () => {
  const storedBots = localStorage.getItem("bots");
  return storedBots ? JSON.parse(storedBots) : [];
};

// Mock data for demonstration
const generateMockBots = () => {
  return Array.from({ length: 6 }, (_, index) => ({
    id: (index + 1).toString(),
    name: "Martingale acc test",
    market: "Volatility 100 (1s) Index",
    tradeType: "Rise/Fall",
    strategy: ["Repeat", "Martingale", "D'Alembert", "Oscar's Grind", "Fibonacci"][index % 5],
    params: [
      { key: "repeat_trade", label: "Repeat trade", value: 2 },
      { key: "initial_stake", label: "Initial stake", value: "10.00" },
      { key: "take_profit", label: "Take profit", value: "100.00" },
      { key: "stop_loss", label: "Stop loss", value: "50.00" },
    ],
  }));
};

const mockBots = generateMockBots();

/**
 * Bots: Displays a list of trading bots with search functionality.
 * Inputs: None
 * Output: JSX.Element - Component with bot cards, search functionality, and action buttons
 */
export function Bots() {
  const [bots, setBots] = useState(getStoredBots());

useEffect(() => {
  localStorage.setItem("bots", JSON.stringify(bots));
}, [bots]);
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

  const navigate = useNavigate();

  const handleAddBot = () => {
    navigate("/discover");
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
        return;
    }

    // Filter bots based on search query
    const filteredBots = mockBots.filter(
      (bot) =>
        bot.name.toLowerCase().includes(query.toLowerCase()) ||
        bot.market.toLowerCase().includes(query.toLowerCase()) ||
        bot.strategy.toLowerCase().includes(query.toLowerCase())
    );

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
    const updatedBots = bots.filter(bot => bot.id !== botId);
    setBots(updatedBots);
    localStorage.setItem("bots", JSON.stringify(updatedBots));
  };

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
              onDelete={() => handleDeleteBot(bot.id)}
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
