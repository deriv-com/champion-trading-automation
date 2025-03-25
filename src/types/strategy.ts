import { FormConfig, FieldType, PrefixType } from './form';

export const filterButtons = [
  { key: "all", label: "All Strategies" },
  { key: "long-calls", label: "Long Calls" },
  { key: "short-puts", label: "Short Puts" },
  { key: "iron-condors", label: "Iron Condors" },
  { key: "covered-calls", label: "Covered Calls" },
  { key: "bull-spreads", label: "Bull Spreads" },
] as const;

export type FilterKey = typeof filterButtons[number]['key'];

export interface StrategyFiltersProps {
  selectedFilter: FilterKey;
  onFilterChange: (filter: FilterKey) => void;
  searchText: string;
  onSearchChange: (text: string) => void;
}

export interface Strategy {
  id: string;
  title: string;
  description: string;
  risk?: "low" | "medium" | "high";
  profit?: "limited" | "unlimited";
  category?:
    | "all"
    | "long-calls"
    | "short-puts"
    | "iron-condors"
    | "covered-calls"
    | "bull-spreads";
  isAvailable?: boolean;
}

export interface StrategyDrawerProps {
  strategy: Strategy | null;
  onClose: () => void;
}

// Static symbol field that's common to all strategies
export const SYMBOL_FIELD = {
  name: 'symbol',
  label: 'Symbol',
  type: 'select' as FieldType,
  options: [
    { value: "R_100", label: "Volatility 100 (1s) Index" },
    { value: "R_75", label: "Volatility 75 (1s) Index" },
    { value: "R_50", label: "Volatility 50 (1s) Index" },
    { value: "R_25", label: "Volatility 25 (1s) Index" }
  ]
};

// Common fields for all strategies
const COMMON_FIELDS = [
  {
    name: 'amount',
    label: 'Amount',
    type: 'number-prefix' as FieldType,
    prefixType: 'currency' as PrefixType
  },
  {
    name: 'growth_rate',
    label: 'Growth Rate',
    type: 'number-prefix' as FieldType,
    prefixType: 'percentage' as PrefixType
  }
];

// Define input parameters for each strategy
export const STRATEGY_PARAMS: Record<string, FormConfig> = {
  'repeat-trade': {
    fields: [
      ...COMMON_FIELDS,
      {
        name: 'number_of_trades',
        label: 'Number of Trades',
        type: 'number' as FieldType
      },
      {
        name: 'limit_order.take_profit',
        label: 'Take Profit',
        type: 'number-prefix' as FieldType,
        prefixType: 'currency' as PrefixType
      }
    ]
  },
  'dalembert-trade': {  // Changed from threshold-trade
    fields: [
      ...COMMON_FIELDS,
      {
        name: 'duration',
        label: 'Duration',
        type: 'number' as FieldType
      },
      {
        name: 'profit_threshold',
        label: 'Profit Threshold',
        type: 'number-prefix' as FieldType,
        prefixType: 'currency' as PrefixType
      },
      {
        name: 'loss_threshold',
        label: 'Loss Threshold',
        type: 'number-prefix' as FieldType,
        prefixType: 'currency' as PrefixType
      }
    ]
  },
  'martingale-trade': {
    fields: [
      ...COMMON_FIELDS,
      {
        name: 'multiplier',
        label: 'Multiplier',
        type: 'number-prefix' as FieldType,
        prefixType: 'percentage' as PrefixType
      },
      {
        name: 'max_steps',
        label: 'Maximum Steps',
        type: 'number' as FieldType
      },
      {
        name: 'profit_threshold',
        label: 'Profit Threshold',
        type: 'number-prefix' as FieldType,
        prefixType: 'currency' as PrefixType
      },
      {
        name: 'loss_threshold',
        label: 'Loss Threshold',
        type: 'number-prefix' as FieldType,
        prefixType: 'currency' as PrefixType
      }
    ]
  }
};
