import { Bot } from '../hooks/useBots';

// Field types
export type FieldType = 'text' | 'number' | 'number-prefix' | 'select';
export type PrefixType = 'currency' | 'percentage';

// Basic field configuration
export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  prefixType?: PrefixType; // For number-prefix fields
  options?: { value: string; label: string }[]; // For select fields
}

export interface FormConfig {
  fields: FieldConfig[];
}

// Form values type
export interface StrategyFormProps {
  config?: FormConfig;
  strategyType: string;
  strategyId: string;
  tradeType?: string;
  onBack?: () => void;
  editBot?: Bot;
}

// Base form values that all forms can extend
export interface FormValues {
  [key: string]: string | number | object | undefined;
}
