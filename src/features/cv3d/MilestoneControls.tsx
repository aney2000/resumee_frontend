import type { TimelineKind } from '@/domain/timeline';
import { kindLabels } from '@/features/cv3d/kindLabels';
import { kindColors } from '@/features/cv3d/layout';
import { ALL_KINDS } from '@/features/cv3d/useMilestoneNavigation';
import styles from './Cv3d.module.css';

export interface MilestoneControlsProps {
  /** 1-based position of the selected milestone. */
  readonly position: number;
  readonly total: number;
  readonly activeKinds: readonly TimelineKind[];
  readonly onPrev: () => void;
  readonly onNext: () => void;
  readonly onToggleKind: (kind: TimelineKind) => void;
}

export function MilestoneControls({
  position,
  total,
  activeKinds,
  onPrev,
  onNext,
  onToggleKind,
}: MilestoneControlsProps) {
  return (
    <div className={styles.controls}>
      <div className={styles.stepper}>
        <button
          type="button"
          className={styles.button}
          aria-label="Previous milestone"
          onClick={onPrev}
        >
          ←
        </button>
        <span className={styles.counter}>
          Milestone {position} of {total}
        </span>
        <button
          type="button"
          className={styles.button}
          aria-label="Next milestone"
          onClick={onNext}
        >
          →
        </button>
      </div>
      <div role="group" aria-label="Filter by kind" className={styles.legend}>
        {ALL_KINDS.map((kind) => (
          <button
            key={kind}
            type="button"
            className={styles.toggle}
            aria-pressed={activeKinds.includes(kind)}
            onClick={() => onToggleKind(kind)}
          >
            <span
              className={styles.swatch}
              style={{ background: kindColors[kind] }}
              aria-hidden="true"
              data-testid="kind-swatch"
            />
            {kindLabels[kind]}
          </button>
        ))}
      </div>
    </div>
  );
}
