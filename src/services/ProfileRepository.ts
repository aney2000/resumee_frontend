import type { Profile } from '@/domain/profile';

// UI depends on this seam, not on the data file, so the source (static file, API, test fake) can change.
export interface ProfileRepository {
  getProfile(): Promise<Profile>;
}

export class StaticProfileRepository implements ProfileRepository {
  private readonly profile: Profile;

  constructor(profile: Profile) {
    this.profile = profile;
  }

  getProfile(): Promise<Profile> {
    return Promise.resolve(this.profile);
  }
}
