import type { ReactNode } from 'react';
import styles from './Section.module.css';

interface SectionProps {
  readonly id: string;
  readonly title: string;
  readonly eyebrow?: string;
  readonly children: ReactNode;
}

export function Section({ id, title, eyebrow, children }: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className={styles.section}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h2 id={headingId} className={styles.title}>
        {title}
      </h2>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
