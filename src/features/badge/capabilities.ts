import { useEffect, useState } from 'react';

type CanvasFactory = () => Pick<HTMLCanvasElement, 'getContext'>;
type MatchMedia = (query: string) => MediaQueryList;

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function supportsWebGL(
  createCanvas: CanvasFactory = () => document.createElement('canvas'),
): boolean {
  try {
    const canvas = createCanvas();
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

const defaultMatchMedia: MatchMedia | undefined =
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? (query) => window.matchMedia(query)
    : undefined;

export function usePrefersReducedMotion(
  matchMedia: MatchMedia | undefined = defaultMatchMedia,
): boolean {
  const [reduced, setReduced] = useState(() => matchMedia?.(REDUCED_MOTION_QUERY).matches ?? false);

  useEffect(() => {
    if (!matchMedia) return undefined;
    const list = matchMedia(REDUCED_MOTION_QUERY);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    setReduced(list.matches);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [matchMedia]);

  return reduced;
}
