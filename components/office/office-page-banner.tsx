import type { ReactNode } from 'react';

type OfficePageBannerProps = {
  eyebrow: string;
  title: string;
  description: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function OfficePageBanner({
  eyebrow,
  title,
  description,
  actions,
  className
}: OfficePageBannerProps) {
  return (
    <section className={className ? `page-banner office-banner ${className}` : 'page-banner office-banner'}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </section>
  );
}
