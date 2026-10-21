import type { Profile } from '@/domain/profile';
import type { ProfileRepository } from '@/services/ProfileRepository';

export function resolvingRepository(profile: Profile): ProfileRepository {
  return { getProfile: () => Promise.resolve(profile) };
}

export function rejectingRepository(error: Error): ProfileRepository {
  return { getProfile: () => Promise.reject(error) };
}
