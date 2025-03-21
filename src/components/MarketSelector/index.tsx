/**
 * @file: MarketSelector/index.tsx
 * @description: Component for selecting trading markets with filtering, search,
 *               favorites management, and categorized display of market options.
 *
 * @components:
 *   - MarketSelector: Main component for market selection
 *   - Market sections: Synthetics, Continuous Indices, Crash/Boom, Forex
 * @dependencies:
 *   - React: Core functionality and state management
 *   - antd: Input, Tabs components and icons
 *   - types/market: Market data types and sample data
 *   - MarketIcon: Custom icon component for market symbols
 * @usage:
 *   <MarketSelector
 *     onSelectMarket={(market) => handleMarketSelection(market)}
 *     selectedMarket={currentMarket}
 *   />
 *
 * @architecture: Compound component with filtering and categorization
 * @relationships:
 *   - Used by: Trading forms and market selection interfaces
 *   - Uses: MarketIcon component for visual representation
 * @dataFlow:
 *   - Input: Selected market and selection callback
 *   - State: Search query, active tab, favorite markets
 *   - Output: Market selection events
 *
 * @ai-hints: This component handles multiple filtering methods (tabs, search, favorites)
 *            and organizes markets into categories. It uses conditional rendering
 *            to display different sections based on the active tab and search state.
 */
import React, { useState } from "react";
import { Input, Tabs } from "antd";
import { SearchOutlined, StarOutlined, StarFilled } from "@ant-design/icons";
import { marketData, MarketInfo } from "../../types/market";
import "./styles.scss";
import { MarketIcon } from "./MarketIcons/MarketIcon";

interface MarketSelectorProps {
  onSelectMarket: (market: MarketInfo) => void;
  selectedMarket?: MarketInfo;
}

// Define tab types
type TabType = "favorites" | "all" | "derived" | "forex" | "crash_boom";

export const MarketSelector: React.FC<MarketSelectorProps> = ({
  onSelectMarket,
  selectedMarket,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [favoriteMarkets, setFavoriteMarkets] = useState<string[]>([]);

  // Group markets by type for display
  const syntheticMarkets = marketData.filter(
    (market) =>
      market.market_name === "synthetic_index" && !market.symbol.includes("1HZ")
  );

  const continuousIndicesMarkets = marketData.filter(
    (market) =>
      market.market_name === "synthetic_index" && market.symbol.includes("1HZ")
  );

  const crashBoomMarkets = marketData.filter(
    (market) => market.market_name === "crash_boom"
  );

  const forexMarkets = marketData.filter(
    (market) => market.market_name === "forex"
  );

  // We don't filter the markets by tab anymore, we just use the tab to determine which sections to show
  const filteredMarkets = searchQuery
    ? marketData.filter(
        (market) =>
          market.displayName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          market.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : marketData;

  const favoriteFilteredMarkets = filteredMarkets.filter((market) =>
    favoriteMarkets.includes(market.symbol)
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabType);
    setSearchQuery("");
  };

  const toggleFavorite = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the market selection
    setFavoriteMarkets((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  const handleSelectMarket = (market: MarketInfo) => {
    onSelectMarket(market);
  };

  // Render market sections based on active tab and search query
  const renderMarketSections = () => {
    if (searchQuery) {
      // When searching, show all matching markets without sections
      return (
        <div className="market-section">
          {filteredMarkets.length > 0 ? (
            filteredMarkets.map((market) => renderMarketItem(market))
          ) : (
            <div className="no-markets">No markets match your search</div>
          )}
        </div>
      );
    }

    if (activeTab === "favorites") {
      return (
        <div className="market-section">
          {favoriteFilteredMarkets.length > 0 ? (
            favoriteFilteredMarkets.map((market) => renderMarketItem(market))
          ) : (
            <div className="no-markets">No favorite markets found</div>
          )}
        </div>
      );
    }

    // For other tabs, show relevant sections
    const showSynthetics = activeTab === "all" || activeTab === "derived";
    const showContinuous = activeTab === "all" || activeTab === "derived";
    const showCrashBoom = activeTab === "all" || activeTab === "crash_boom";
    const showForex = activeTab === "all" || activeTab === "forex";

    return (
      <>
        {showSynthetics && syntheticMarkets.length > 0 && (
          <div className="market-section">
            <h3 className="section-title">Synthetics</h3>
            {syntheticMarkets.map((market) => renderMarketItem(market))}
          </div>
        )}

        {showContinuous && continuousIndicesMarkets.length > 0 && (
          <div className="market-section">
            <h3 className="section-title">Continuous Indices</h3>
            {continuousIndicesMarkets.map((market) => renderMarketItem(market))}
          </div>
        )}

        {showCrashBoom && crashBoomMarkets.length > 0 && (
          <div className="market-section">
            <h3 className="section-title">Crash/Boom</h3>
            {crashBoomMarkets.map((market) => renderMarketItem(market))}
          </div>
        )}

        {showForex && forexMarkets.length > 0 && (
          <div className="market-section">
            <h3 className="section-title">Forex</h3>
            {forexMarkets.map((market) => renderMarketItem(market))}
          </div>
        )}
      </>
    );
  };

  // Render individual market item
  const renderMarketItem = (market: MarketInfo) => {
    const isSelected = selectedMarket?.symbol === market.symbol;
    const isFavorite = favoriteMarkets.includes(market.symbol);

    return (
      <div
        key={market.symbol}
        className={`market-item ${isSelected ? "selected" : ""} ${
          market.isClosed ? "closed" : ""
        }`}
        onClick={() => !market.isClosed && handleSelectMarket(market)}
      >
        <div className="market-item-left">
          <MarketIcon symbol={market.symbol} />
          <span className="market-name">{market.displayName}</span>
          {market.isClosed && <span className="market-closed-tag">Closed</span>}
        </div>
        <div
          className="market-favorite"
          onClick={(e) => toggleFavorite(market.symbol, e)}
        >
          {isFavorite ? (
            <StarFilled className="star-filled" />
          ) : (
            <StarOutlined className="star-outline" />
          )}
        </div>
      </div>
    );
  };

  // Define tab items for Ant Design Tabs
  const tabItems = [
    {
      key: "favorites",
      label: "Favourites",
    },
    {
      key: "all",
      label: "All",
    },
    {
      key: "derived",
      label: "Derived",
    },
    {
      key: "forex",
      label: "Forex",
    },
    {
      key: "crash_boom",
      label: "Crash",
    },
  ];

  return (
    <div className="market-selector">
      <div className="market-selector-search">
        <Input
          placeholder="Search markets on Rise/Fall"
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={handleSearch}
          className="market-search-input"
        />
      </div>

      <div className="market-selector-tabs-container">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
          className="market-selector-tabs"
        />
      </div>

      <div className="market-content">{renderMarketSections()}</div>
    </div>
  );
};

export default MarketSelector;
