import { StrategyForm } from '../StrategyForm';
import { FormConfig } from '../../types/form';
import './styles.scss';

import { StrategyDrawerProps, SYMBOL_FIELD, STRATEGY_PARAMS } from '../../types/strategy';

export function StrategyDrawer({ strategy, onClose }: StrategyDrawerProps) {
  if (!strategy) return null;

  const strategyParams = STRATEGY_PARAMS[strategy.id];
  if (!strategyParams) return null;

  // Combine the static symbol field with strategy-specific fields
  const config: FormConfig = {
    fields: [SYMBOL_FIELD, ...strategyParams.fields]
  };

  return (
    <>
      <div className="strategy-drawer__backdrop" onClick={onClose} />
      <div className="strategy-drawer strategy-drawer--open">
        <div className="strategy-drawer__body">
          <StrategyForm
            config={config}
            strategyType={strategy.title}
            strategyId={strategy.id}
            tradeType="Accumulators"
            onBack={onClose}
          />
        </div>
      </div>
    </>
  );
}
