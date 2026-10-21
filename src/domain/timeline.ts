import { compareYearMonth } from '@/domain/dateRange';
import type { Profile, YearMonth } from '@/domain/profile';
import { defaultTimelineSources } from '@/domain/timelineSources';

export type TimelineKind = 'experience' | 'education' | 'project' | 'course';

export interface TimelineEntry {
  readonly id: string;
  readonly kind: TimelineKind;
  readonly title: string;
  readonly subtitle: string;
  readonly start: YearMonth;
  readonly end?: YearMonth;
  readonly description: string;
}

/** Extracts timeline entries of one kind from a profile. */
export type TimelineSource = (profile: Profile) => readonly TimelineEntry[];

function compareEndDescending(a: TimelineEntry, b: TimelineEntry): number {
  if (a.end === b.end) return 0;
  if (a.end === undefined) return -1;
  if (b.end === undefined) return 1;
  return compareYearMonth(b.end, a.end);
}

function compareNewestFirst(a: TimelineEntry, b: TimelineEntry): number {
  return (
    compareYearMonth(b.start, a.start) || compareEndDescending(a, b) || a.id.localeCompare(b.id)
  );
}

export function buildTimeline(
  profile: Profile,
  sources: readonly TimelineSource[] = Object.values(defaultTimelineSources),
): TimelineEntry[] {
  return sources.flatMap((source) => source(profile)).sort(compareNewestFirst);
}
