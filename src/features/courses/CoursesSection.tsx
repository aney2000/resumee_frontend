import type { Course } from '@/domain/profile';
import { formatYearMonth } from '@/domain/dateRange';
import { Section } from '@/ui/Section';
import { TagList } from '@/ui/TagList';
import { sortCoursesNewestFirst } from '@/features/courses/sortCourses';
import styles from './CoursesSection.module.css';

interface CoursesSectionProps {
  readonly id: string;
  readonly courses: readonly Course[];
}

export function CoursesSection({ id, courses }: CoursesSectionProps) {
  return (
    <Section id={id} title="Courses" eyebrow="Learning">
      <ul aria-label="Completed courses" className={styles.grid}>
        {sortCoursesNewestFirst(courses).map((course) => (
          <li key={course.id} className={styles.course}>
            <h3 className={styles.title}>{course.title}</h3>
            <p className={styles.meta}>
              <span>{course.provider}</span>
              <time dateTime={course.completedOn}>{formatYearMonth(course.completedOn)}</time>
            </p>
            <TagList label={`Skills from ${course.title}`} tags={course.skills} />
            {course.certificateUrl && (
              <a
                href={course.certificateUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`View certificate for ${course.title}`}
                className={styles.link}
              >
                View certificate
              </a>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
