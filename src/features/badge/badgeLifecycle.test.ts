import { act, renderHook } from '@testing-library/react';
import {
  badgeLifecycleReducer,
  INITIAL_BADGE_LIFECYCLE,
  useBadgeLifecycle,
} from '@/features/badge/badgeLifecycle';

describe('badgeLifecycleReducer', () => {
  it('starts with the first badge showing its front', () => {
    expect(INITIAL_BADGE_LIFECYCLE).toEqual({ generation: 0, flipped: false });
  });

  it('toggles the visible face', () => {
    const flipped = badgeLifecycleReducer(INITIAL_BADGE_LIFECYCLE, { type: 'flip' });

    expect(flipped.flipped).toBe(true);
    expect(badgeLifecycleReducer(flipped, { type: 'flip' }).flipped).toBe(false);
  });

  it('replaces a stuck badge with a fresh one showing its front', () => {
    const stuck = badgeLifecycleReducer(INITIAL_BADGE_LIFECYCLE, { type: 'flip' });

    expect(badgeLifecycleReducer(stuck, { type: 'reset' })).toEqual({
      generation: 1,
      flipped: false,
    });
  });
});

describe('useBadgeLifecycle', () => {
  it('exposes the state and its actions', () => {
    const { result } = renderHook(() => useBadgeLifecycle());

    act(() => result.current.flip());
    expect(result.current.flipped).toBe(true);

    act(() => result.current.reset());
    expect(result.current).toMatchObject({ generation: 1, flipped: false });
  });
});
