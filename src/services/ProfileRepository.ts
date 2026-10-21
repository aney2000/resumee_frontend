import type { Profile } from '@/domain/profile';

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
