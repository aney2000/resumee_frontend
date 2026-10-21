import { profileData } from '@/data/profile.data';
import { validateProfile } from '@/domain/validateProfile';

describe('placeholder profile data', () => {
  it('validates with zero errors', () => {
    expect(validateProfile(profileData)).toEqual([]);
  });

  it('provides the expected placeholder content', () => {
    expect(profileData.identity.fullName).toBe('Your Name');
    expect(profileData.identity.headline).toBe('Frontend Engineer');
    expect(profileData.identity.photoUrl).toBe('/photo.svg');
    expect(profileData.experiences).toHaveLength(3);
    expect(profileData.education).toHaveLength(2);
    expect(profileData.projects).toHaveLength(3);
    expect(profileData.courses).toHaveLength(4);
    expect(profileData.skills.length).toBeGreaterThan(0);
    expect(profileData.identity.socials.length).toBeGreaterThan(0);
  });
});
