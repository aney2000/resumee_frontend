import styles from './HeroActions.module.css';

export interface HeroActionsProps {
  readonly contactHref?: string;
}

export function HeroActions({ contactHref }: HeroActionsProps) {
  if (!contactHref) return null;

  return (
    <div className={styles.actions}>
      <a className={`${styles.action} ${styles.primary}`} href={contactHref}>
        Get in touch
      </a>
    </div>
  );
}
