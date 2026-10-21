import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { ProfileProvider, useProfile } from '@/app/ProfileContext';
import type { ProfileRepository } from '@/services/ProfileRepository';
import { createProfile } from '@/test/profileFixture';
import { rejectingRepository, resolvingRepository } from '@/test/fakeProfileRepository';

function wrapperFor(repository: ProfileRepository) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <ProfileProvider repository={repository}>{children}</ProfileProvider>;
  };
}

describe('ProfileProvider / useProfile', () => {
  it('starts in the loading state', () => {
    const repository: ProfileRepository = { getProfile: () => new Promise(() => undefined) };

    const { result } = renderHook(() => useProfile(), { wrapper: wrapperFor(repository) });

    expect(result.current).toEqual({ status: 'loading' });
  });

  it('exposes the profile once the repository resolves', async () => {
    const profile = createProfile();

    const { result } = renderHook(() => useProfile(), {
      wrapper: wrapperFor(resolvingRepository(profile)),
    });

    await waitFor(() => expect(result.current).toEqual({ status: 'ready', profile }));
  });

  it('exposes the error when the repository rejects', async () => {
    const error = new Error('boom');

    const { result } = renderHook(() => useProfile(), {
      wrapper: wrapperFor(rejectingRepository(error)),
    });

    await waitFor(() => expect(result.current).toEqual({ status: 'error', error }));
  });

  it('loads the profile only once per repository', async () => {
    const getProfile = vi.fn(() => Promise.resolve(createProfile()));

    const { result } = renderHook(() => useProfile(), {
      wrapper: wrapperFor({ getProfile }),
    });

    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(getProfile).toHaveBeenCalledTimes(1);
  });

  it('renders its children', async () => {
    render(
      <ProfileProvider repository={resolvingRepository(createProfile())}>
        <p>child</p>
      </ProfileProvider>,
    );

    expect(await screen.findByText('child')).toBeInTheDocument();
    await act(() => Promise.resolve());
  });

  it('throws a clear error when used outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => renderHook(() => useProfile())).toThrow(
      'useProfile must be used within a ProfileProvider',
    );
  });
});
