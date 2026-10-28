import { lazy, Suspense, useState } from 'react';
import type { BadgeContent } from '@/features/badge/badgeContent';
import { useBadgeLifecycle } from '@/features/badge/badgeLifecycle';
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
      <Suspense fallback={<FlipBadge content={content} />}>
        <LanyardCanvas content={content} flipped={badge.flipped} onFlip={badge.flip} />
      </Suspense>
      <p className={styles.hint} aria-hidden="true">
        Drag me · click to flip
      </p>
    </div>
  );
}
