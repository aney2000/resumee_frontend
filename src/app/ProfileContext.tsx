import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Profile } from '@/domain/profile';
import type { ProfileRepository } from '@/services/ProfileRepository';

export type ProfileState =
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly profile: Profile }
  | { readonly status: 'error'; readonly error: Error };

const ProfileContext = createContext<ProfileState | undefined>(undefined);

function toError(reason: unknown): Error {
  return reason instanceof Error ? reason : new Error(String(reason));
}

interface ProfileProviderProps {
  readonly repository: ProfileRepository;
  readonly children: ReactNode;
}

export function ProfileProvider({ repository, children }: ProfileProviderProps) {
  const [state, setState] = useState<ProfileState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });
    repository.getProfile().then(
      (profile) => {
        if (active) setState({ status: 'ready', profile });
      },
      (reason: unknown) => {
        if (active) setState({ status: 'error', error: toError(reason) });
      },
    );
    return () => {
      active = false;
    };
  }, [repository]);

  return <ProfileContext.Provider value={state}>{children}</ProfileContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is colocated with its provider
export function useProfile(): ProfileState {
  const state = useContext(ProfileContext);
  if (state === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return state;
}
