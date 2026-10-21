import type { Experience } from '@/domain/profile';
import { durationInMonths, formatDateRange, formatDuration } from '@/domain/dateRange';
import { Section } from '@/ui/Section';
import { TagList } from '@/ui/TagList';
import { Timeline, type TimelineItem } from '@/features/timeline/Timeline';
import styles from './ExperienceSection.module.css';

interface ExperienceSectionProps {
  readonly id: string;
  readonly experiences: readonly Experience[];
  readonly now: Date;
}

function toTimelineItem(experience: Experience, now: Date): TimelineItem {
  return {
    id: experience.id,
    title: experience.role,
    subtitle: experience.company,
    period: formatDateRange(experience.period),
    duration: formatDuration(durationInMonths(experience.period, now)),
    description: experience.description,
    details: (
      <>
        {experience.highlights.length > 0 && (
          <ul aria-label={`Highlights at ${experience.company}`} className={styles.highlights}>
            {experience.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        )}
        <TagList
          label={`Technologies used at ${experience.company}`}
          tags={experience.technologies}
        />
      </>
    ),
  };
}

export function ExperienceSection({ id, experiences, now }: ExperienceSectionProps) {
  return (
    <Section id={id} title="Experience" eyebrow="Career">
      <Timeline
        label="Work experience"
        items={experiences.map((experience) => toTimelineItem(experience, now))}
      />
    </Section>
  );
}
