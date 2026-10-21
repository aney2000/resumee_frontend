export type LabelVisibility = 'full' | 'dot';

/**
 * Declutters the journey: only the selected milestone and its neighbours within
 * `radius` steps get a full label; the rest render as a bare dot.
 * A negative `selectedIndex` means nothing is selected.
 */
export function labelVisibility(index: number, selectedIndex: number, radius = 1): LabelVisibility {
  if (selectedIndex < 0) return 'dot';
  return Math.abs(index - selectedIndex) <= radius ? 'full' : 'dot';
}
