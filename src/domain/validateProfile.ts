import { compareYearMonth, parseYearMonth } from '@/domain/dateRange';
import type { DateRange, Profile, YearMonth } from '@/domain/profile';

function isValidYearMonth(value: YearMonth): boolean {
  try {
    parseYearMonth(value);
    return true;
  } catch {
    return false;
  }
}

function validateYearMonth(value: YearMonth, path: string): string[] {
  return isValidYearMonth(value) ? [] : [`${path} "${value}" is not a valid YYYY-MM`];
}

function validateRange(range: DateRange, path: string): string[] {
  const problems = [
    ...validateYearMonth(range.start, `${path}.start`),
    ...(range.end === undefined ? [] : validateYearMonth(range.end, `${path}.end`)),
  ];
  if (problems.length > 0 || range.end === undefined) return problems;
  return compareYearMonth(range.end, range.start) < 0
    ? [`${path} ends ("${range.end}") before it starts ("${range.start}")`]
    : [];
}

function validateIdentity(profile: Profile): string[] {
  return profile.identity.fullName.trim() === '' ? ['identity.fullName must not be empty'] : [];
}

function validateDates(profile: Profile): string[] {
  return [
    ...profile.experiences.flatMap((e) => validateRange(e.period, `experiences[${e.id}].period`)),
    ...profile.education.flatMap((e) => validateRange(e.period, `education[${e.id}].period`)),
    ...profile.projects.flatMap((p) =>
      p.period ? validateRange(p.period, `projects[${p.id}].period`) : [],
    ),
    ...profile.courses.flatMap((c) =>
      validateYearMonth(c.completedOn, `courses[${c.id}].completedOn`),
    ),
  ];
}

function validateUniqueIds(profile: Profile): string[] {
  const ids = [
    ...profile.experiences,
    ...profile.education,
    ...profile.projects,
    ...profile.courses,
  ].map((item) => item.id);
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  return [...duplicates].map((id) => `duplicate id "${id}"`);
}

const rules: readonly ((profile: Profile) => string[])[] = [
  validateIdentity,
  validateDates,
  validateUniqueIds,
];

/** Returns a list of human-readable problems; an empty list means the profile is valid. */
export function validateProfile(profile: Profile): string[] {
  return rules.flatMap((rule) => rule(profile));
}
