import { act, renderHook } from '@testing-library/react';
import { supportsWebGL, usePrefersReducedMotion } from '@/features/badge/capabilities';

const canvasWith = (getContext: (id: string) => unknown) =>
  ({ getContext }) as unknown as HTMLCanvasElement;

describe('supportsWebGL', () => {
  it('is true when a webgl2 context is available', () => {
    expect(supportsWebGL(() => canvasWith((id) => (id === 'webgl2' ? {} : null)))).toBe(true);
  });

  it('falls back to a webgl context', () => {
    expect(supportsWebGL(() => canvasWith((id) => (id === 'webgl' ? {} : null)))).toBe(true);
  });

  it('is false when no context is available', () => {
    expect(supportsWebGL(() => canvasWith(() => null))).toBe(false);
  });

  it('is false when creating the context throws', () => {
    expect(
      supportsWebGL(() =>
        canvasWith(() => {
          throw new Error('blocked');
        }),
      ),
    ).toBe(false);
  });
});

function fakeMatchMedia(initial: boolean) {
  let listener: ((event: MediaQueryListEvent) => void) | undefined;
  const list = {
    matches: initial,
    addEventListener: vi.fn((_: string, l: (event: MediaQueryListEvent) => void) => {
      listener = l;
    }),
    removeEventListener: vi.fn(),
  };
  const matchMedia = vi.fn(() => list as unknown as MediaQueryList);
  const emit = (matches: boolean) => listener?.({ matches } as MediaQueryListEvent);
  return { matchMedia, list, emit };
}

describe('usePrefersReducedMotion', () => {
  it('reads the reduced-motion media query', () => {
    const { matchMedia } = fakeMatchMedia(true);

    const { result } = renderHook(() => usePrefersReducedMotion(matchMedia));

    expect(result.current).toBe(true);
    expect(matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });

  it('reacts to preference changes and unsubscribes on unmount', () => {
    const { matchMedia, list, emit } = fakeMatchMedia(false);
    const { result, unmount } = renderHook(() => usePrefersReducedMotion(matchMedia));
    expect(result.current).toBe(false);

    act(() => emit(true));
    expect(result.current).toBe(true);

    unmount();
    expect(list.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('is false when matchMedia is unavailable', () => {
    const { result } = renderHook(() => usePrefersReducedMotion(undefined));

    expect(result.current).toBe(false);
  });
});
