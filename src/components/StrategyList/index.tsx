import { useState } from 'react';
import { PageTitle } from '../PageTitle';
import { StrategyCard } from '../StrategyCard';
import { StrategyDrawer } from '../StrategyDrawer';
import { Strategy } from '../../types/strategy';
import './styles.scss';

// Sample strategy data - in a real app, this would come from an API or context
const strategies: Strategy[] = [
  {
    id: 'repeat-trade',
    title: 'Repeat',
    description: 'Automate and run multiple trades for each instrument.'
  },
  {
    id: 'martingale-trade',
    title: 'Martingale',
    description: 'Increase stake after each loss to recoup prior losses with a single successful trade.'
  },
  {
    id: 'threshold-trade',
    title: 'D\'Alembert',
    description: 'Increase stake after a losing trade and reduce it after a successful trade by a predetermined number of units.'
  }
];

export function StrategyList() {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  
  const handleStrategyClick = (strategyId: string) => {
    const strategy = strategies.find(s => s.id === strategyId);
    if (strategy) {
      setSelectedStrategy(strategy);
    }
  };
  
  const handleCloseDrawer = () => {
    setSelectedStrategy(null);
  };
  
  return (
    <div className="strategy-list-page">
      <PageTitle 
        title="Strategy"
        subtitle="Start by selecting a strategy to build your bot."
      />
      
      <div className="strategy-list">
        {strategies.map(strategy => (
          <StrategyCard 
            key={strategy.id}
            title={strategy.title}
            description={strategy.description}
            onClick={() => handleStrategyClick(strategy.id)}
          />
        ))}
      </div>
      
      <StrategyDrawer 
        strategy={selectedStrategy} 
        onClose={handleCloseDrawer} 
      />
    </div>
  );
}
