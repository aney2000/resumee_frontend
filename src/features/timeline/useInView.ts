import { useEffect, useRef, useState, type RefObject } from 'react';

export interface InViewEnvironment {
  readonly IntersectionObserver: typeof IntersectionObserver | undefined;
  readonly prefersReducedMotion: boolean;
}

export function detectInViewEnvironment(): InViewEnvironment {
  if (typeof window === 'undefined') {
    return { IntersectionObserver: undefined, prefersReducedMotion: true };
  }
  return {
    IntersectionObserver: window.IntersectionObserver,
    prefersReducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  };
}

function canAnimate(environment: InViewEnvironment): boolean {
  return environment.IntersectionObserver !== undefined && !environment.prefersReducedMotion;
}

export function useInView<T extends Element>(
  environment: InViewEnvironment = detectInViewEnvironment(),
): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const animate = canAnimate(environment);
  const [inView, setInView] = useState(!animate);
  const Observer = environment.IntersectionObserver;

  useEffect(() => {
    const element = ref.current;
    if (!animate || !Observer || !element) return;

    const observer = new Observer((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setInView(true);
        observer.disconnect();
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [animate, Observer]);

  return [ref, inView];
}
