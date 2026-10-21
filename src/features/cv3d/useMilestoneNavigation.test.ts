import { act, renderHook } from '@testing-library/react';
import type { TimelineEntry } from '@/domain/timeline';
import {
  ALL_KINDS,
  initNavigation,
  navigationReducer,
  useMilestoneNavigation,
  visibleEntries,
} from '@/features/cv3d/useMilestoneNavigation';

const entry = (id: string, kind: TimelineEntry['kind']): TimelineEntry => ({
  id,
  kind,
  title: id,
  subtitle: '',
  start: '2020-01',
  description: '',
});

const entries = [
  entry('a', 'experience'),
  entry('b', 'education'),
  entry('c', 'experience'),
  entry('d', 'project'),
  entry('e', 'course'),
];

describe('navigationReducer', () => {
  const initial = initNavigation(entries);

  it('starts at the first milestone with every kind active', () => {
    expect(initial.selectedIndex).toBe(0);
    expect(initial.activeKinds).toEqual(ALL_KINDS);
  });

  it('moves next and prev with wrapping', () => {
    const last = navigationReducer(initial, { type: 'prev' });
    expect(last.selectedIndex).toBe(4);
    expect(navigationReducer(last, { type: 'next' }).selectedIndex).toBe(0);
    expect(navigationReducer(initial, { type: 'next' }).selectedIndex).toBe(1);
  });

  it('selects by id and ignores unknown ids', () => {
    expect(navigationReducer(initial, { type: 'select', id: 'c' }).selectedIndex).toBe(2);
    expect(navigationReducer(initial, { type: 'select', id: 'zzz' })).toBe(initial);
  });

  it('keeps the selected entry selected when filtering removes others', () => {
    const atC = navigationReducer(initial, { type: 'select', id: 'c' });
    const filtered = navigationReducer(atC, { type: 'toggleKind', kind: 'education' });
    expect(visibleEntries(filtered)[filtered.selectedIndex]?.id).toBe('c');
    expect(filtered.selectedIndex).toBe(1);
  });

  it('keeps the selection in range when the selected entry is filtered out', () => {
    const atD = navigationReducer(initial, { type: 'select', id: 'd' });
    const filtered = navigationReducer(atD, { type: 'toggleKind', kind: 'project' });
    expect(filtered.selectedIndex).toBeLessThan(visibleEntries(filtered).length);
  });

  it('never allows an empty filter set', () => {
    let state = initial;
    for (const kind of ['experience', 'education', 'project'] as const) {
      state = navigationReducer(state, { type: 'toggleKind', kind });
    }
    expect(state.activeKinds).toEqual(['course']);
    const attempt = navigationReducer(state, { type: 'toggleKind', kind: 'course' });
    expect(attempt).toBe(state);
  });

  it('refuses a filter that would leave no visible milestone', () => {
    const onlyProjects = ['experience', 'education', 'course'].reduce(
      (state, kind) => navigationReducer(state, { type: 'toggleKind', kind: kind as never }),
      initial,
    );
    expect(visibleEntries(onlyProjects).map((e) => e.id)).toEqual(['d']);
    expect(navigationReducer(onlyProjects, { type: 'toggleKind', kind: 'project' })).toBe(
      onlyProjects,
    );
  });

  it('re-enables a kind when toggled again', () => {
    const off = navigationReducer(initial, { type: 'toggleKind', kind: 'project' });
    const on = navigationReducer(off, { type: 'toggleKind', kind: 'project' });
    expect(on.activeKinds).toContain('project');
  });
});

describe('useMilestoneNavigation', () => {
  it('exposes the visible entries, selection and actions', () => {
    const { result } = renderHook(() => useMilestoneNavigation(entries));
    expect(result.current.selected?.id).toBe('a');
    act(() => result.current.next());
    expect(result.current.selected?.id).toBe('b');
    act(() => result.current.toggleKind('education'));
    expect(result.current.visible.map((e) => e.id)).toEqual(['a', 'c', 'd', 'e']);
    act(() => result.current.select('d'));
    expect(result.current.selected?.id).toBe('d');
    act(() => result.current.prev());
    expect(result.current.selected?.id).toBe('c');
  });
});
