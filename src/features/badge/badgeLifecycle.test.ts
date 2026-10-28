import { act, renderHook } from '@testing-library/react';
import {
  badgeLifecycleReducer,
  INITIAL_BADGE_LIFECYCLE,
  useBadgeLifecycle,
  type BadgeLifecycleAction,
  type BadgeLifecycleState,
} from '@/features/badge/badgeLifecycle';

const run = (...actions: BadgeLifecycleAction[]): BadgeLifecycleState =>
  actions.reduce(badgeLifecycleReducer, INITIAL_BADGE_LIFECYCLE);

describe('badgeLifecycleReducer', () => {
  it('starts with the first badge hanging and showing its front', () => {
    expect(INITIAL_BADGE_LIFECYCLE).toEqual({ generation: 0, flipped: false, phase: 'attached' });
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
      phase: 'attached',
    });
  });

  it('sends the scissors only to a hanging badge', () => {
    const cutting = run({ type: 'cut' });

    expect(cutting.phase).toBe('cutting');
    expect(badgeLifecycleReducer(cutting, { type: 'cut' })).toBe(cutting);
  });

  it('drops the badge once the scissors snip the lanyard', () => {
    expect(run({ type: 'cut' }, { type: 'snipped' }).phase).toBe('falling');
    expect(run({ type: 'snipped' })).toBe(INITIAL_BADGE_LIFECYCLE);
  });

  it('hangs a fresh badge showing its front once the cut one has fallen out of view', () => {
    const fallen = run({ type: 'flip' }, { type: 'cut' }, { type: 'snipped' }, { type: 'fellOut' });

    expect(fallen).toEqual({ generation: 1, flipped: false, phase: 'attached' });
    expect(badgeLifecycleReducer(fallen, { type: 'fellOut' })).toBe(fallen);
  });

  it('lets a reset abort a cut in progress', () => {
    expect(run({ type: 'cut' }, { type: 'reset' })).toEqual({
      generation: 1,
      flipped: false,
      phase: 'attached',
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

    act(() => result.current.cut());
    expect(result.current.phase).toBe('cutting');
    act(() => result.current.snipped());
    expect(result.current.phase).toBe('falling');
    act(() => result.current.fellOut());
    expect(result.current).toMatchObject({ generation: 2, phase: 'attached' });
  });
});
