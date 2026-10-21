import { sortCoursesNewestFirst } from '@/features/courses/sortCourses';
import type { Course } from '@/domain/profile';

const course = (id: string, completedOn: string): Course => ({
  id,
  title: id,
  provider: 'P',
  completedOn,
  skills: [],
});

describe('sortCoursesNewestFirst', () => {
  it('orders courses by completion month, newest first, without mutating input', () => {
    const input = [course('a', '2021-05'), course('b', '2023-01'), course('c', '2022-11')];

    expect(sortCoursesNewestFirst(input).map((c) => c.id)).toEqual(['b', 'c', 'a']);
    expect(input.map((c) => c.id)).toEqual(['a', 'b', 'c']);
  });
});
