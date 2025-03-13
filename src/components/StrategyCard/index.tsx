import { RobotFilled, RightOutlined } from '@ant-design/icons';
import './styles.scss';

interface StrategyCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

export function StrategyCard({ title, description, onClick }: StrategyCardProps) {
  return (
    <div className="strategy-card" onClick={onClick}>
      <div className="strategy-card__icon">
        <RobotFilled />
      </div>
      <div className="strategy-card__content">
        <h3 className="strategy-card__title">{title}</h3>
        <p className="strategy-card__description">{description}</p>
      </div>
      <div className="strategy-card__arrow">
        <RightOutlined />
      </div>
    </div>
  );
}
