import { lazy, Suspense, useState } from 'react';
import type { BadgeContent } from '@/features/badge/badgeContent';
import { useBadgeLifecycle } from '@/features/badge/badgeLifecycle';
import { BadgeControls } from '@/features/badge/BadgeControls';
import { supportsWebGL } from '@/features/badge/capabilities';
import { FlipBadge } from '@/features/badge/FlipBadge';
import styles from './HeroBadge.module.css';

// Lazy so three.js / rapier stay out of the initial bundle.
const LanyardCanvas = lazy(() => import('./scene/LanyardCanvas'));

export interface HeroBadgeProps {
  readonly content: BadgeContent;
  readonly canUseWebGL?: () => boolean;
}

/** Picks the physics lanyard when the device can run it, otherwise the CSS flip badge. */
export function HeroBadge({ content, canUseWebGL = supportsWebGL }: HeroBadgeProps) {
  const [webGL] = useState(canUseWebGL);
  const badge = useBadgeLifecycle();

  if (!webGL) return <FlipBadge content={content} />;

  return (
    <div className={styles.stage}>
      <button
        type="button"
        className={styles.skipToggle}
        aria-pressed={badge.flipped}
        aria-label="Flip badge"
        onClick={badge.flip}
      >
        Flip badge
      </button>
      <BadgeControls onReset={badge.reset} onCut={badge.cut} canCut={badge.phase === 'attached'} />
      <Suspense fallback={<FlipBadge content={content} />}>
        <LanyardCanvas
          content={content}
          generation={badge.generation}
          flipped={badge.flipped}
          phase={badge.phase}
          onFlip={badge.flip}
          onSnip={badge.snipped}
          onFellOut={badge.fellOut}
        />
      </Suspense>
      <p className={styles.hint} aria-hidden="true">
        Drag me · click to flip
      </p>
    </div>
  );
}
