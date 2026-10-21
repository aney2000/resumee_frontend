import { buildTimeline, type TimelineEntry, type TimelineSource } from '@/domain/timeline';
import type { Course, Education, Experience, Project } from '@/domain/profile';
import { createProfile } from '@/test/profileFixture';

const experience: Experience = {
  id: 'exp-1',
  role: 'Frontend Engineer',
  company: 'Acme',
  period: { start: '2021-03' },
  description: 'Built UIs',
  highlights: [],
  technologies: [],
};

const education: Education = {
  id: 'edu-1',
  degree: 'BSc Computer Science',
  institution: 'Uni',
  period: { start: '2015-09', end: '2018-06' },
  description: 'Studied CS',
};

const project: Project = {
  id: 'prj-1',
  name: 'Portfolio',
  description: '3D CV',
  technologies: [],
  period: { start: '2023-01', end: '2023-04' },
};

const course: Course = {
  id: 'crs-1',
  title: 'Testing JavaScript',
  provider: 'Online Academy',
  completedOn: '2022-05',
  skills: [],
};

describe('buildTimeline', () => {
  it('returns an empty list for an empty profile', () => {
    expect(buildTimeline(createProfile())).toEqual([]);
  });

  it('maps an experience', () => {
    const [entry] = buildTimeline(createProfile({ experiences: [experience] }));

    expect(entry).toEqual<TimelineEntry>({
      id: 'exp-1',
      kind: 'experience',
      title: 'Frontend Engineer',
      subtitle: 'Acme',
      start: '2021-03',
      end: undefined,
      description: 'Built UIs',
    });
  });

  it('maps an education entry', () => {
    const [entry] = buildTimeline(createProfile({ education: [education] }));

    expect(entry).toEqual<TimelineEntry>({
      id: 'edu-1',
      kind: 'education',
      title: 'BSc Computer Science',
      subtitle: 'Uni',
      start: '2015-09',
      end: '2018-06',
      description: 'Studied CS',
    });
  });

  it('maps a project with a period', () => {
    const [entry] = buildTimeline(createProfile({ projects: [project] }));

    expect(entry).toEqual<TimelineEntry>({
      id: 'prj-1',
      kind: 'project',
      title: 'Portfolio',
      subtitle: 'Side project',
      start: '2023-01',
      end: '2023-04',
      description: '3D CV',
    });
  });

  it('skips projects without a period', () => {
    const undated: Project = { ...project, id: 'prj-2', period: undefined };

    expect(buildTimeline(createProfile({ projects: [undated] }))).toEqual([]);
  });

  it('maps a course as a single-month entry', () => {
    const [entry] = buildTimeline(createProfile({ courses: [course] }));

    expect(entry).toEqual<TimelineEntry>({
      id: 'crs-1',
      kind: 'course',
      title: 'Testing JavaScript',
      subtitle: 'Online Academy',
      start: '2022-05',
      end: '2022-05',
      description: '',
    });
  });

  it('sorts all kinds newest first by start date', () => {
    const timeline = buildTimeline(
      createProfile({
        experiences: [experience],
        education: [education],
        projects: [project],
        courses: [course],
      }),
    );

    expect(timeline.map((e) => e.id)).toEqual(['prj-1', 'crs-1', 'exp-1', 'edu-1']);
  });

  it('breaks start ties by putting ongoing and later-ending entries first', () => {
    const ended: Experience = {
      ...experience,
      id: 'exp-ended',
      period: { start: '2021-03', end: '2022-01' },
    };
    const later: Experience = {
      ...experience,
      id: 'exp-later',
      period: { start: '2021-03', end: '2023-01' },
    };
    const ongoing: Experience = { ...experience, id: 'exp-ongoing', period: { start: '2021-03' } };

    const timeline = buildTimeline(createProfile({ experiences: [ended, later, ongoing] }));

    expect(timeline.map((e) => e.id)).toEqual(['exp-ongoing', 'exp-later', 'exp-ended']);
  });

  it('breaks full ties deterministically by id', () => {
    const b: Course = { ...course, id: 'crs-b' };
    const a: Course = { ...course, id: 'crs-a' };

    const forward = buildTimeline(createProfile({ courses: [b, a] }));
    const reverse = buildTimeline(createProfile({ courses: [a, b] }));

    expect(forward.map((e) => e.id)).toEqual(['crs-a', 'crs-b']);
    expect(reverse.map((e) => e.id)).toEqual(['crs-a', 'crs-b']);
  });

  it('accepts custom sources so new kinds can be added without modification', () => {
    const custom: TimelineSource = () => [
      {
        id: 'custom-1',
        kind: 'project',
        title: 'Custom',
        subtitle: 'Extra',
        start: '2030-01',
        description: '',
      },
    ];

    const timeline = buildTimeline(createProfile({ courses: [course] }), [custom]);

    expect(timeline.map((e) => e.id)).toEqual(['custom-1']);
  });
});
