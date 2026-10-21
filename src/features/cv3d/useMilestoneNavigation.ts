import { useCallback, useMemo, useReducer } from 'react';
import type { TimelineEntry, TimelineKind } from '@/domain/timeline';

export const ALL_KINDS: readonly TimelineKind[] = ['experience', 'education', 'project', 'course'];

export interface NavigationState {
  /** All entries in path order; filtering never mutates this. */
  readonly entries: readonly TimelineEntry[];
  readonly activeKinds: readonly TimelineKind[];
  /** Index into the visible (filtered) entries. */
  readonly selectedIndex: number;
}

export type NavigationAction =
  | { readonly type: 'next' }
  | { readonly type: 'prev' }
  | { readonly type: 'select'; readonly id: string }
  | { readonly type: 'toggleKind'; readonly kind: TimelineKind };

export function initNavigation(entries: readonly TimelineEntry[]): NavigationState {
  return { entries, activeKinds: ALL_KINDS, selectedIndex: 0 };
}

function filterByKinds(
  entries: readonly TimelineEntry[],
  kinds: readonly TimelineKind[],
): TimelineEntry[] {
  return entries.filter((entry) => kinds.includes(entry.kind));
}

export function visibleEntries(state: NavigationState): TimelineEntry[] {
  return filterByKinds(state.entries, state.activeKinds);
}

function step(state: NavigationState, delta: number): NavigationState {
  const count = visibleEntries(state).length;
  if (count === 0) return state;
  return { ...state, selectedIndex: (state.selectedIndex + delta + count) % count };
}

function toggleKind(state: NavigationState, kind: TimelineKind): NavigationState {
  const activeKinds = state.activeKinds.includes(kind)
    ? state.activeKinds.filter((k) => k !== kind)
    : ALL_KINDS.filter((k) => k === kind || state.activeKinds.includes(k));
  const nextVisible = filterByKinds(state.entries, activeKinds);
  // Never leave the user with an empty journey.
  if (activeKinds.length === 0 || nextVisible.length === 0) return state;

  const selectedId = visibleEntries(state)[state.selectedIndex]?.id;
  const kept = nextVisible.findIndex((entry) => entry.id === selectedId);
  const selectedIndex = kept >= 0 ? kept : Math.min(state.selectedIndex, nextVisible.length - 1);
  return { ...state, activeKinds, selectedIndex };
}

export function navigationReducer(
  state: NavigationState,
  action: NavigationAction,
): NavigationState {
  switch (action.type) {
    case 'next':
      return step(state, 1);
    case 'prev':
      return step(state, -1);
    case 'select': {
      const index = visibleEntries(state).findIndex((entry) => entry.id === action.id);
      return index < 0 || index === state.selectedIndex
        ? state
        : { ...state, selectedIndex: index };
    }
    case 'toggleKind':
      return toggleKind(state, action.kind);
  }
}

export interface MilestoneNavigation {
  readonly visible: readonly TimelineEntry[];
  readonly selected: TimelineEntry | undefined;
  readonly selectedIndex: number;
  readonly activeKinds: readonly TimelineKind[];
  readonly next: () => void;
  readonly prev: () => void;
  readonly select: (id: string) => void;
  readonly toggleKind: (kind: TimelineKind) => void;
}

/** Selection + kind filter over entries already ordered along the path. */
export function useMilestoneNavigation(entries: readonly TimelineEntry[]): MilestoneNavigation {
  const [state, dispatch] = useReducer(navigationReducer, entries, initNavigation);
  const visible = useMemo(() => visibleEntries(state), [state]);

  return {
    visible,
    selected: visible[state.selectedIndex],
    selectedIndex: state.selectedIndex,
    activeKinds: state.activeKinds,
    next: useCallback(() => dispatch({ type: 'next' }), []),
    prev: useCallback(() => dispatch({ type: 'prev' }), []),
    select: useCallback((id: string) => dispatch({ type: 'select', id }), []),
    toggleKind: useCallback((kind: TimelineKind) => dispatch({ type: 'toggleKind', kind }), []),
  };
}
