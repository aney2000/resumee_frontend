import { useState } from 'react';
import type { BadgeContent, BadgeFront } from '@/features/badge/badgeContent';
import { initials } from '@/features/badge/badgeContent';
import styles from './FlipBadge.module.css';

export interface FlipBadgeProps {
  readonly content: BadgeContent;
}

function BadgePhoto({ name, photoUrl }: Pick<BadgeFront, 'name' | 'photoUrl'>) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  if (!photoUrl || failedUrl === photoUrl) {
    return (
      <span className={styles.initials} aria-hidden="true">
        {initials(name)}
      </span>
    );
  }
  return (
    <img
      className={styles.photo}
      src={photoUrl}
      alt={name}
      onError={() => setFailedUrl(photoUrl)}
    />
  );
}

export function FlipBadge({ content }: FlipBadgeProps) {
  const [flipped, setFlipped] = useState(false);
  const { front, back } = content;

  return (
    <div className={styles.wrapper}>
      <div className={styles.strap} aria-hidden="true" />
      <button
        type="button"
        className={styles.badge}
        aria-pressed={flipped}
        aria-label="Flip badge"
        onClick={() => setFlipped((value) => !value)}
      >
        <span className={`${styles.card} ${flipped ? styles.flipped : ''}`}>
          <span
            className={`${styles.face} ${styles.front}`}
            data-testid="badge-front"
            aria-hidden={flipped ? true : undefined}
          >
            <span className={styles.clip} aria-hidden="true" />
            <span className={styles.organization}>{front.organization}</span>
            <BadgePhoto name={front.name} photoUrl={front.photoUrl} />
            <span className={styles.name}>{front.name}</span>
            <span className={styles.title}>{front.title}</span>
            <span className={styles.barcode} aria-hidden="true" />
            <span className={styles.badgeId}>{front.badgeId}</span>
          </span>
          <span
            className={`${styles.face} ${styles.back}`}
            data-testid="badge-back"
            aria-hidden={flipped ? undefined : true}
          >
            <span className={styles.summary}>{back.summary}</span>
            <span className={styles.location}>{back.location}</span>
            <span className={styles.contacts}>
              {back.contacts.map((contact) => (
                <span key={contact.url} className={styles.contact}>
                  {contact.label}
                </span>
              ))}
            </span>
          </span>
        </span>
      </button>
      <p role="status" aria-live="polite" className={styles.visuallyHidden}>
        {flipped ? 'Showing back of badge' : 'Showing front of badge'}
      </p>
    </div>
  );
}
