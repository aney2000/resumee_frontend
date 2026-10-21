import type { Education } from '@/domain/profile';
import { durationInMonths, formatDateRange, formatDuration } from '@/domain/dateRange';
import { Section } from '@/ui/Section';
import { Timeline, type TimelineItem } from '@/features/timeline/Timeline';

interface EducationSectionProps {
  readonly id: string;
  readonly education: readonly Education[];
  readonly now: Date;
}

function toTimelineItem(entry: Education, now: Date): TimelineItem {
  return {
    id: entry.id,
    title: entry.degree,
    subtitle: entry.institution,
    period: formatDateRange(entry.period),
    duration: formatDuration(durationInMonths(entry.period, now)),
    description: entry.description,
  };
}

export function EducationSection({ id, education, now }: EducationSectionProps) {
  return (
    <Section id={id} title="Education" eyebrow="Studies">
      <Timeline
        label="Education history"
        items={education.map((entry) => toTimelineItem(entry, now))}
      />
    </Section>
  );
}
