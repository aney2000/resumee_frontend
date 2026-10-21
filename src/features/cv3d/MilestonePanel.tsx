import { formatDateRange } from '@/domain/dateRange';
import type { TimelineEntry } from '@/domain/timeline';
import { kindLabels } from '@/features/cv3d/kindLabels';
import { kindColors } from '@/features/cv3d/layout';
import styles from './Cv3d.module.css';

export interface MilestonePanelProps {
  readonly entry: TimelineEntry | undefined;
}

export function MilestonePanel({ entry }: MilestonePanelProps) {
  return (
    <div className={styles.panel} aria-live="polite" data-testid="milestone-panel">
      {entry ? (
        <article style={{ borderColor: kindColors[entry.kind] }} className={styles.panelCard}>
          <p className={styles.kind} style={{ color: kindColors[entry.kind] }}>
            {kindLabels[entry.kind]}
          </p>
          <h3 className={styles.panelTitle}>{entry.title}</h3>
          <p className={styles.subtitle}>{entry.subtitle}</p>
          <p className={styles.range}>{formatDateRange(entry)}</p>
          <p>{entry.description}</p>
        </article>
      ) : (
        <p>No milestone selected</p>
      )}
    </div>
  );
}
