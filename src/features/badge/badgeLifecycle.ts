import { useCallback, useReducer } from 'react';

export interface BadgeLifecycleState {
  /** Bumped whenever a fresh badge replaces the current one; used as the scene's remount key. */
  readonly generation: number;
  readonly flipped: boolean;
}

export type BadgeLifecycleAction = { readonly type: 'flip' } | { readonly type: 'reset' };

export const INITIAL_BADGE_LIFECYCLE: BadgeLifecycleState = { generation: 0, flipped: false };

function freshBadge(state: BadgeLifecycleState): BadgeLifecycleState {
  return { generation: state.generation + 1, flipped: false };
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
  }
}

export interface BadgeLifecycle extends BadgeLifecycleState {
  readonly flip: () => void;
  readonly reset: () => void;
}

/** Which badge is on stage and which face it shows. */
export function useBadgeLifecycle(): BadgeLifecycle {
  const [state, dispatch] = useReducer(badgeLifecycleReducer, INITIAL_BADGE_LIFECYCLE);

  return {
    ...state,
    flip: useCallback(() => dispatch({ type: 'flip' }), []),
    reset: useCallback(() => dispatch({ type: 'reset' }), []),
  };
}
