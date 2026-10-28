import { lazy, Suspense, useMemo, useState, type KeyboardEvent } from 'react';
import type { TimelineEntry } from '@/domain/timeline';
import { supportsWebGL } from '@/features/badge/capabilities';
import { kindColors, layoutMilestones } from '@/features/cv3d/layout';
import { MilestoneControls } from '@/features/cv3d/MilestoneControls';
import { MilestonePanel } from '@/features/cv3d/MilestonePanel';
import { useMilestoneNavigation } from '@/features/cv3d/useMilestoneNavigation';
import { Section } from '@/ui/Section';
import styles from './Cv3d.module.css';

// Lazy so three.js stays out of the initial bundle.
const JourneyCanvas = lazy(() => import('./scene/JourneyCanvas'));

export interface Cv3dSectionProps {
  readonly id: string;
  readonly entries: readonly TimelineEntry[];
  readonly canUseWebGL?: () => boolean;
}

interface FallbackListProps {
  readonly entries: readonly TimelineEntry[];
  readonly selectedId: string | undefined;
  readonly onSelect: (id: string) => void;
}

function FallbackList({ entries, selectedId, onSelect }: FallbackListProps) {
  return (
    <ol className={styles.list} aria-label="Milestones">
      {entries.map((entry) => (
        <li key={entry.id}>
          <button
            type="button"
            className={`${styles.toggle} ${styles.item}`}
            aria-current={entry.id === selectedId}
            onClick={() => onSelect(entry.id)}
          >
            <span
              className={styles.swatch}
              style={{ background: kindColors[entry.kind] }}
              aria-hidden="true"
            />
            {entry.title}
          </button>
        </li>
      ))}
    </ol>
  );
}

/** Chronological 3D journey through the timeline, with an accessible 2D fallback. */
export function Cv3dSection({ id, entries, canUseWebGL = supportsWebGL }: Cv3dSectionProps) {
  const [capable] = useState(canUseWebGL);

  const pathOrder = useMemo(() => layoutMilestones(entries).map((m) => m.entry), [entries]);
  const nav = useMilestoneNavigation(pathOrder);
  const milestones = useMemo(() => layoutMilestones(nav.visible), [nav.visible]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') nav.next();
    else if (event.key === 'ArrowLeft') nav.prev();
    else return;
    event.preventDefault();
  };

  const fallback = (
    <FallbackList entries={nav.visible} selectedId={nav.selected?.id} onSelect={nav.select} />
  );

  return (
    <Section id={id} title="My journey in 3D" eyebrow="3D CV" hideInPrint>
      <div
        className={styles.layout}
        tabIndex={0}
        role="group"
        aria-label="Milestone journey, use left and right arrow keys to navigate"
        onKeyDown={onKeyDown}
      >
        <div className={styles.stage}>
          {capable ? (
            <Suspense fallback={fallback}>
              <JourneyCanvas
                milestones={milestones}
                selectedId={nav.selected?.id}
                onSelect={nav.select}
              />
            </Suspense>
          ) : (
            fallback
          )}
        </div>
        <div className={styles.side}>
          <MilestoneControls
            position={nav.selectedIndex + 1}
            total={nav.visible.length}
            activeKinds={nav.activeKinds}
            onPrev={nav.prev}
            onNext={nav.next}
            onToggleKind={nav.toggleKind}
          />
          <MilestonePanel entry={nav.selected} />
        </div>
      </div>
    </Section>
  );
}
