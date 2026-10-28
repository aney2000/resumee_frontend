import { renderHook } from '@testing-library/react';
import { useTouchScrollGuard } from '@/features/badge/scene/useTouchScrollGuard';

/** Returns whether the page would have been kept from scrolling. */
function touchMove(target: EventTarget): boolean {
  const event = new Event('touchmove', { cancelable: true });
  target.dispatchEvent(event);
  return event.defaultPrevented;
}

describe('useTouchScrollGuard', () => {
  it('keeps the page from scrolling while active', () => {
    const element = document.createElement('div');
    renderHook(() => useTouchScrollGuard(element, () => true));

    expect(touchMove(element)).toBe(true);
  });

  it('lets the page scroll while inactive', () => {
    const element = document.createElement('div');
    renderHook(() => useTouchScrollGuard(element, () => false));

    expect(touchMove(element)).toBe(false);
  });

  it('listens non-passively, since passive listeners cannot cancel scrolling', () => {
    const element = document.createElement('div');
    const addListener = vi.spyOn(element, 'addEventListener');
    renderHook(() => useTouchScrollGuard(element, () => true));

    expect(addListener).toHaveBeenCalledWith('touchmove', expect.any(Function), { passive: false });
  });

  it('stops guarding once unmounted', () => {
    const element = document.createElement('div');
    const { unmount } = renderHook(() => useTouchScrollGuard(element, () => true));
    unmount();

    expect(touchMove(element)).toBe(false);
  });
});
