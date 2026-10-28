import { compareYearMonth } from '@/domain/dateRange';
import type { TimelineEntry, TimelineKind } from '@/domain/timeline';
import { palette } from '@/styles/palette';

export type Vec3 = readonly [number, number, number];

export interface Milestone {
  readonly entry: TimelineEntry;
  readonly position: Vec3;
}

export interface LayoutOptions {
  /** Distance between consecutive milestones along the path (−z). */
  readonly spacing?: number;
  /** Maximum sideways deviation of the spiral. */
  readonly radius?: number;
  /** Angle (radians) the spiral turns per milestone. */
  readonly turn?: number;
}

export interface CameraTarget {
  readonly position: Vec3;
  readonly lookAt: Vec3;
}

// Record forces a colour for every TimelineKind at compile time.
export const kindColors: Record<TimelineKind, string> = {
  experience: palette.accent,
  education: palette.accent2,
  project: '#f472b6',
  course: '#facc15',
};

const DEFAULTS: Required<LayoutOptions> = { spacing: 4.5, radius: 2.5, turn: Math.PI / 3 };
// Back, up and to the side: keeps the ±1 neighbours (one spacing away) inside a 50° fov.
const CAMERA_OFFSET: Vec3 = [3, 2.5, 9];

function compareOldestFirst(a: TimelineEntry, b: TimelineEntry): number {
  return compareYearMonth(a.start, b.start) || a.id.localeCompare(b.id);
}

/** Places entries chronologically (oldest first) along a gentle spiral receding into −z. */
export function layoutMilestones(
  entries: readonly TimelineEntry[],
  options: LayoutOptions = {},
): Milestone[] {
  const { spacing, radius, turn } = { ...DEFAULTS, ...options };
  return [...entries].sort(compareOldestFirst).map((entry, index) => {
    const angle = index * turn;
    return {
      entry,
      position: [radius * Math.sin(angle), radius * 0.4 * Math.sin(angle * 0.5), -index * spacing],
    };
  });
}

export function cameraTargetFor(position: Vec3): CameraTarget {
  const [x, y, z] = position;
  return {
    position: [x + CAMERA_OFFSET[0], y + CAMERA_OFFSET[1], z + CAMERA_OFFSET[2]],
    lookAt: position,
  };
}
