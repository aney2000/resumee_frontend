import type { ReactNode } from 'react';
import { useInView } from '@/features/timeline/useInView';
import styles from './Timeline.module.css';

export interface TimelineItem {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly period: string;
  readonly duration?: string;
  readonly description: string;
  readonly details?: ReactNode;
}

interface TimelineProps {
  readonly label: string;
  readonly items: readonly TimelineItem[];
}

export function Timeline({ label, items }: TimelineProps) {
  return (
    <ol aria-label={label} className={styles.timeline}>
      {items.map((item) => (
        <TimelineEntry key={item.id} item={item} />
      ))}
    </ol>
  );
}

function TimelineEntry({ item }: { readonly item: TimelineItem }) {
  const [ref, inView] = useInView<HTMLLIElement>();

  return (
    <li ref={ref} className={`${styles.item} ${inView ? styles.visible : ''}`}>
      <span className={styles.dot} aria-hidden="true" />
      <div className={styles.content}>
        <p className={styles.meta}>
          <span>{item.period}</span>
          {item.duration && <span className={styles.duration}>{item.duration}</span>}
        </p>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.subtitle}>{item.subtitle}</p>
        <p className={styles.description}>{item.description}</p>
        {item.details}
      </div>
    </li>
  );
}
