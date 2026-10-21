import type { Profile } from '@/domain/profile';

export function createProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    identity: {
      fullName: 'Test Person',
      headline: 'Engineer',
      location: 'Somewhere',
      photoUrl: '/photo.svg',
      summary: 'Summary',
      badgeId: 'ID-0001',
      organization: 'Test Org',
      socials: [],
    },
    experiences: [],
    education: [],
    projects: [],
    courses: [],
    skills: [],
    ...overrides,
  };
}
