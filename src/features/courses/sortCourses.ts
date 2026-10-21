import type { Course } from '@/domain/profile';
import { compareYearMonth } from '@/domain/dateRange';

export function sortCoursesNewestFirst(courses: readonly Course[]): Course[] {
  return [...courses].sort((a, b) => compareYearMonth(b.completedOn, a.completedOn));
}
