import { useEffect } from 'react';

/**
 * Keeps the page from scrolling under a finger while `isActive()` holds, e.g. while a canvas
 * object is dragged. Elsewhere the page scrolls normally, unlike a blanket `touch-action: none`.
 */
export function useTouchScrollGuard(target: EventTarget | null, isActive: () => boolean): void {
  useEffect(() => {
    if (!target) return undefined;
    const onTouchMove = (event: Event) => {
      if (isActive()) event.preventDefault();
    };
    target.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => target.removeEventListener('touchmove', onTouchMove);
  }, [target, isActive]);
}
