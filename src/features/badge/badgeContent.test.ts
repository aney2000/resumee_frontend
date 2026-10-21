import { initials, toBadgeContent } from '@/features/badge/badgeContent';
import { createProfile } from '@/test/profileFixture';

const identity = {
  ...createProfile().identity,
  fullName: 'Ada Lovelace',
  headline: 'Analytical Engine Programmer',
  organization: 'Babbage & Co',
  photoUrl: '/ada.png',
  badgeId: 'AE-1843',
  summary: 'First to publish an algorithm.',
  location: 'London, UK',
  socials: [
    { label: 'GitHub', url: 'https://github.com/ada', kind: 'github' as const },
    { label: 'Email', url: 'mailto:ada@example.com', kind: 'email' as const },
  ],
};

describe('toBadgeContent', () => {
  it('maps the identity onto the badge front', () => {
    expect(toBadgeContent(identity).front).toEqual({
      name: 'Ada Lovelace',
      title: 'Analytical Engine Programmer',
      organization: 'Babbage & Co',
      photoUrl: '/ada.png',
      badgeId: 'AE-1843',
    });
  });

  it('maps summary, location and socials onto the badge back', () => {
    expect(toBadgeContent(identity).back).toEqual({
      summary: 'First to publish an algorithm.',
      location: 'London, UK',
      contacts: [
        { label: 'GitHub', url: 'https://github.com/ada' },
        { label: 'Email', url: 'mailto:ada@example.com' },
      ],
    });
  });
});

describe('initials', () => {
  it.each([
    ['Ada Lovelace', 'AL'],
    ['ada', 'A'],
    ['  Grace   Brewster Murray Hopper ', 'GH'],
    ['', ''],
  ])('derives initials of %j as %j', (name, expected) => {
    expect(initials(name)).toBe(expected);
  });
});
