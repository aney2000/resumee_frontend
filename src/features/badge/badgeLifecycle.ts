import { useCallback, useReducer } from 'react';

/** attached: hangs on the lanyard; cutting: scissors on their way; falling: lanyard cut. */
export type BadgePhase = 'attached' | 'cutting' | 'falling';

export interface BadgeLifecycleState {
  /** Bumped whenever a fresh badge replaces the current one; used as the scene's remount key. */
  readonly generation: number;
  readonly flipped: boolean;
  readonly phase: BadgePhase;
}

export type BadgeLifecycleAction =
  | { readonly type: 'flip' }
  | { readonly type: 'reset' }
  | { readonly type: 'cut' }
  | { readonly type: 'snipped' }
  | { readonly type: 'fellOut' };

export const INITIAL_BADGE_LIFECYCLE: BadgeLifecycleState = {
  generation: 0,
  flipped: false,
  phase: 'attached',
};

function freshBadge(state: BadgeLifecycleState): BadgeLifecycleState {
  return { generation: state.generation + 1, flipped: false, phase: 'attached' };
}

// Scene signals can arrive late (e.g. several frames report the fall); ignore them out of phase.
function advance(
  state: BadgeLifecycleState,
  from: BadgePhase,
  to: (state: BadgeLifecycleState) => BadgeLifecycleState,
): BadgeLifecycleState {
  return state.phase === from ? to(state) : state;
}

export function badgeLifecycleReducer(
  state: BadgeLifecycleState,
  action: BadgeLifecycleAction,
): BadgeLifecycleState {
  switch (action.type) {
    case 'flip':
      return { ...state, flipped: !state.flipped };
    case 'reset':
      return freshBadge(state);
    case 'cut':
      return advance(state, 'attached', (s) => ({ ...s, phase: 'cutting' }));
    case 'snipped':
      return advance(state, 'cutting', (s) => ({ ...s, phase: 'falling' }));
    case 'fellOut':
      return advance(state, 'falling', freshBadge);
  }
}

export interface BadgeLifecycle extends BadgeLifecycleState {
  readonly flip: () => void;
  readonly reset: () => void;
  readonly cut: () => void;
  readonly snipped: () => void;
  readonly fellOut: () => void;
}

/** Which badge is on stage, which face it shows and how far a lanyard cut has progressed. */
export function useBadgeLifecycle(): BadgeLifecycle {
  const [state, dispatch] = useReducer(badgeLifecycleReducer, INITIAL_BADGE_LIFECYCLE);

  return {
    ...state,
    flip: useCallback(() => dispatch({ type: 'flip' }), []),
    reset: useCallback(() => dispatch({ type: 'reset' }), []),
    cut: useCallback(() => dispatch({ type: 'cut' }), []),
    snipped: useCallback(() => dispatch({ type: 'snipped' }), []),
    fellOut: useCallback(() => dispatch({ type: 'fellOut' }), []),
  };
}
