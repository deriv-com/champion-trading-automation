import './styles.scss';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageTitle({ title, subtitle, className = '' }: PageTitleProps) {
  return (
    <div className={`page-title ${className}`}>
      <h1 className="page-title__heading">{title}</h1>
      {subtitle && <p className="page-title__subtitle">{subtitle}</p>}
    </div>
  );
}
