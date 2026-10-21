import { lazy, Suspense, useState } from 'react';
import type { BadgeContent } from '@/features/badge/badgeContent';
import { supportsWebGL, usePrefersReducedMotion } from '@/features/badge/capabilities';
import { FlipBadge } from '@/features/badge/FlipBadge';
import styles from './HeroBadge.module.css';

// Lazy so three.js / rapier stay out of the initial bundle.
const LanyardCanvas = lazy(() => import('./scene/LanyardCanvas'));

export interface HeroBadgeProps {
  readonly content: BadgeContent;
  readonly canUseWebGL?: () => boolean;
  readonly prefersReducedMotion?: boolean;
}

/** Picks the physics lanyard when the device can run it, otherwise the CSS flip badge. */
export function HeroBadge({
  content,
  canUseWebGL = supportsWebGL,
  prefersReducedMotion,
}: HeroBadgeProps) {
  const systemReducedMotion = usePrefersReducedMotion();
  const [webGL] = useState(canUseWebGL);
  const [flipped, setFlipped] = useState(false);
  const reducedMotion = prefersReducedMotion ?? systemReducedMotion;

  if (!webGL || reducedMotion) return <FlipBadge content={content} />;

  const flip = () => setFlipped((value) => !value);

  return (
    <div className={styles.stage}>
      <button
        type="button"
        className={styles.skipToggle}
        aria-pressed={flipped}
        aria-label="Flip badge"
        onClick={flip}
      >
        Flip badge
      </button>
      <Suspense fallback={<FlipBadge content={content} />}>
        <LanyardCanvas content={content} flipped={flipped} onFlip={flip} />
      </Suspense>
      <p className={styles.hint} aria-hidden="true">
        Drag me · click to flip
      </p>
    </div>
  );
}
