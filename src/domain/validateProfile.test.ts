import { validateProfile } from '@/domain/validateProfile';
import type { Course, Education, Experience, Project } from '@/domain/profile';
import { createProfile } from '@/test/profileFixture';

const experience: Experience = {
  id: 'exp-1',
  role: 'Engineer',
  company: 'Acme',
  period: { start: '2020-01', end: '2021-01' },
  description: '',
  highlights: [],
  technologies: [],
};

const education: Education = {
  id: 'edu-1',
  degree: 'BSc',
  institution: 'Uni',
  period: { start: '2015-09', end: '2018-06' },
  description: '',
};

const project: Project = { id: 'prj-1', name: 'Site', description: '', technologies: [] };

const course: Course = {
  id: 'crs-1',
  title: 'Course',
  provider: 'Provider',
  completedOn: '2022-01',
  skills: [],
};

describe('validateProfile', () => {
  it('returns no problems for a valid profile', () => {
    const profile = createProfile({
      experiences: [experience],
      education: [education],
      projects: [project],
      courses: [course],
    });

    expect(validateProfile(profile)).toEqual([]);
  });

  it('reports an empty fullName', () => {
    const base = createProfile();
    const profile = createProfile({ identity: { ...base.identity, fullName: '   ' } });

    expect(validateProfile(profile)).toEqual(['identity.fullName must not be empty']);
  });

  it('reports invalid YearMonth values with their location', () => {
    const profile = createProfile({
      experiences: [{ ...experience, period: { start: '2020-13' } }],
      courses: [{ ...course, completedOn: 'May 2022' }],
    });

    expect(validateProfile(profile)).toEqual([
      'experiences[exp-1].period.start "2020-13" is not a valid YYYY-MM',
      'courses[crs-1].completedOn "May 2022" is not a valid YYYY-MM',
    ]);
  });

  it('reports a period whose end is before its start', () => {
    const profile = createProfile({
      education: [{ ...education, period: { start: '2018-06', end: '2015-09' } }],
    });

    expect(validateProfile(profile)).toEqual([
      'education[edu-1].period ends ("2015-09") before it starts ("2018-06")',
    ]);
  });

  it('checks optional project periods', () => {
    const profile = createProfile({
      projects: [{ ...project, period: { start: '2023-05', end: '2023-01' } }],
    });

    expect(validateProfile(profile)).toEqual([
      'projects[prj-1].period ends ("2023-01") before it starts ("2023-05")',
    ]);
  });

  it('reports duplicate ids across all sections once per id', () => {
    const profile = createProfile({
      experiences: [experience, { ...experience }],
      courses: [{ ...course, id: 'exp-1' }],
    });

    expect(validateProfile(profile)).toEqual(['duplicate id "exp-1"']);
  });

  it('collects multiple problems', () => {
    const base = createProfile();
    const profile = createProfile({
      identity: { ...base.identity, fullName: '' },
      experiences: [experience, { ...experience, period: { start: 'bad' } }],
    });

    expect(validateProfile(profile)).toHaveLength(3);
  });
});
