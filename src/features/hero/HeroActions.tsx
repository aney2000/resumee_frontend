import styles from './HeroActions.module.css';

export interface HeroActionsProps {
  readonly contactHref?: string;
  readonly onDownloadCv: () => void;
}

export function HeroActions({ contactHref, onDownloadCv }: HeroActionsProps) {
  return (
    <div className={styles.actions} data-print="hide">
      {contactHref && (
        <a className={`${styles.action} ${styles.primary}`} href={contactHref}>
          Get in touch
        </a>
      )}
      <button type="button" className={styles.action} onClick={onDownloadCv}>
        Download CV
      </button>
    </div>
  );
}
