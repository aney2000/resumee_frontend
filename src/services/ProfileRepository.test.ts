import { StaticProfileRepository } from '@/services/ProfileRepository';
import { createProfile } from '@/test/profileFixture';

describe('StaticProfileRepository', () => {
  it('resolves the injected profile', async () => {
    const profile = createProfile();
    const repository = new StaticProfileRepository(profile);

    await expect(repository.getProfile()).resolves.toBe(profile);
  });
});
