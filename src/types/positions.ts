import { TradeInfo } from './trade';

export type ProfitStatus = 'all' | 'profit' | 'loss';
export type SortBy = 'time' | 'profit';

export interface PositionsFilters {
  strategy: string | null;
  profitStatus: ProfitStatus;
  sortBy: SortBy;
  sortDirection: 'asc' | 'desc';
}

export interface TradeCardProps {
  trade: TradeInfo;
  loading?: boolean;
  onClose?: (sessionId: string) => void;
  lastUpdated?: Date;
}

export interface TradeFiltersProps {
  filters: PositionsFilters;
  onFiltersChange: (filters: PositionsFilters) => void;
  loading?: boolean;
}

export interface TradeGridProps {
  trades: TradeInfo[];
  loading?: boolean;
  onClose?: (sessionId: string) => void;
  lastUpdated?: Record<string, Date>;
}