import React from 'react';
import { Space, Select } from 'antd';
import { TradeStrategy } from '../../../../types/trade';
import { TradeFiltersProps } from '../../../../types/positions';
import './styles.scss';

const { Option } = Select;

const TradeFilters: React.FC<TradeFiltersProps> = ({
  filters,
  onFiltersChange,
  loading
}) => {
  const handleStrategyChange = (value: string | null) => {
    onFiltersChange({ ...filters, strategy: value });
  };

  const handleProfitStatusChange = (value: 'all' | 'profit' | 'loss') => {
    onFiltersChange({ ...filters, profitStatus: value });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortDirection] = value.split('-');
    onFiltersChange({
      ...filters,
      sortBy: sortBy as 'time' | 'profit',
      sortDirection: sortDirection as 'asc' | 'desc'
    });
  };

  return (
    <Space className="trade-filters" wrap>
      <Select
        placeholder="Filter by Strategy"
        value={filters.strategy}
        onChange={handleStrategyChange}
        allowClear
        disabled={loading}
        style={{ width: 160 }}
      >
        <Option value={TradeStrategy.REPEAT}>Repeat Trade</Option>
        <Option value={TradeStrategy.THRESHOLD}>Threshold Trade</Option>
      </Select>

      <Select
        placeholder="Filter by Status"
        value={filters.profitStatus}
        onChange={handleProfitStatusChange}
        disabled={loading}
        style={{ width: 140 }}
      >
        <Option value="all">All Positions</Option>
        <Option value="profit">In Profit</Option>
        <Option value="loss">In Loss</Option>
      </Select>

      <Select
        placeholder="Sort By"
        value={`${filters.sortBy}-${filters.sortDirection}`}
        onChange={handleSortChange}
        disabled={loading}
        style={{ width: 160 }}
      >
        <Option value="time-desc">Newest First</Option>
        <Option value="time-asc">Oldest First</Option>
        <Option value="profit-desc">Highest Profit</Option>
        <Option value="profit-asc">Lowest Profit</Option>
      </Select>
    </Space>
  );
};

export default TradeFilters;