import type { Profile } from '@/domain/profile';
import type { TimelineEntry, TimelineKind, TimelineSource } from '@/domain/timeline';

const experienceSource: TimelineSource = (profile: Profile) =>
  profile.experiences.map((experience): TimelineEntry => ({
    id: experience.id,
    kind: 'experience',
    title: experience.role,
    subtitle: experience.company,
    start: experience.period.start,
    end: experience.period.end,
    description: experience.description,
  }));

const educationSource: TimelineSource = (profile: Profile) =>
  profile.education.map((education): TimelineEntry => ({
    id: education.id,
    kind: 'education',
    title: education.degree,
    subtitle: education.institution,
    start: education.period.start,
    end: education.period.end,
    description: education.description,
  }));

const projectSource: TimelineSource = (profile: Profile) =>
  profile.projects.flatMap((project): TimelineEntry[] =>
    project.period
      ? [
          {
            id: project.id,
            kind: 'project',
            title: project.name,
            subtitle: 'Side project',
            start: project.period.start,
            end: project.period.end,
            description: project.description,
          },
        ]
      : [],
  );

const courseSource: TimelineSource = (profile: Profile) =>
  profile.courses.map((course): TimelineEntry => ({
    id: course.id,
    kind: 'course',
    title: course.title,
    subtitle: course.provider,
    start: course.completedOn,
    end: course.completedOn,
    description: '',
  }));

/** One mapper per kind. Add a new kind by adding an entry; existing mappers stay untouched. */
export const defaultTimelineSources: Readonly<Record<TimelineKind, TimelineSource>> = {
  experience: experienceSource,
  education: educationSource,
  project: projectSource,
  course: courseSource,
};
