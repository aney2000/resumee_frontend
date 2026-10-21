import type {
  DateRange,
  Education,
  Experience,
  Profile,
  SocialLink,
  YearMonth,
} from '@/domain/profile';

describe('profile domain model', () => {
  it('describes a complete profile', () => {
    const profile: Profile = {
      identity: {
        fullName: 'Ada Lovelace',
        headline: 'Engineer',
        location: 'London',
        photoUrl: '/photo.svg',
        summary: 'Summary',
        badgeId: 'ID-1',
        organization: 'Analytical Engines Ltd',
        socials: [{ label: 'GitHub', url: 'https://github.com/ada', kind: 'github' }],
      },
      experiences: [
        {
          id: 'exp-1',
          role: 'Engineer',
          company: 'Acme',
          period: { start: '2020-01' },
          description: 'Did things',
          highlights: ['Shipped'],
          technologies: ['TypeScript'],
        },
      ],
      education: [
        {
          id: 'edu-1',
          degree: 'BSc',
          institution: 'Uni',
          period: { start: '2015-09', end: '2018-06' },
          description: 'Studied',
        },
      ],
      projects: [{ id: 'prj-1', name: 'Site', description: 'Portfolio', technologies: ['React'] }],
      courses: [
        { id: 'crs-1', title: 'Testing', provider: 'Online', completedOn: '2021-03', skills: [] },
      ],
      skills: [{ category: 'Languages', items: ['TypeScript'] }],
    };

    expect(profile.identity.fullName).toBe('Ada Lovelace');
  });

  it('treats a missing end date as an ongoing period', () => {
    expectTypeOf<DateRange['end']>().toEqualTypeOf<YearMonth | undefined>();
    expectTypeOf<Experience['period']>().toEqualTypeOf<DateRange>();
    expectTypeOf<Education['period']>().toEqualTypeOf<DateRange>();
  });

  it('restricts social link kinds', () => {
    expectTypeOf<SocialLink['kind']>().toEqualTypeOf<
      'github' | 'linkedin' | 'email' | 'website' | 'other'
    >();
  });

  it('is readonly', () => {
    expectTypeOf<Profile['experiences']>().toEqualTypeOf<readonly Experience[]>();
    expectTypeOf<Experience['highlights']>().toEqualTypeOf<readonly string[]>();
  });
});
