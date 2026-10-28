import type { ReactNode } from 'react';
import styles from './Section.module.css';

interface SectionProps {
  readonly id: string;
  readonly title: string;
  readonly eyebrow?: string;
  /** For interactive-only content that has no place on paper. */
  readonly hideInPrint?: boolean;
  readonly children: ReactNode;
}

export function Section({ id, title, eyebrow, hideInPrint, children }: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={styles.section}
      data-print={hideInPrint ? 'hide' : undefined}
    >
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h2 id={headingId} className={styles.title}>
        {title}
      </h2>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
