import { render, screen } from '@testing-library/react';
import { App } from '@/App';
import { ProfileProvider } from '@/app/ProfileContext';
import type { ProfileRepository } from '@/services/ProfileRepository';
import { createProfile } from '@/test/profileFixture';
import { rejectingRepository, resolvingRepository } from '@/test/fakeProfileRepository';

function renderApp(repository: ProfileRepository) {
  return render(
    <ProfileProvider repository={repository}>
      <App />
    </ProfileProvider>,
  );
}

describe('App', () => {
  it('shows a loading state while the profile loads', () => {
    renderApp({ getProfile: () => new Promise(() => undefined) });

    expect(screen.getByRole('status')).toHaveTextContent('Loading');
    expect(screen.queryByRole('main')).not.toBeInTheDocument();
  });

  it('renders a main landmark with the full name as heading', async () => {
    const base = createProfile();
    renderApp(
      resolvingRepository(
        createProfile({ identity: { ...base.identity, fullName: 'Ada Lovelace' } }),
      ),
    );

    const main = await screen.findByRole('main');
    expect(main).toContainElement(screen.getByRole('heading', { level: 1, name: 'Ada Lovelace' }));
  });

  it('shows an error state when loading fails', async () => {
    renderApp(rejectingRepository(new Error('Network down')));

    expect(await screen.findByRole('alert')).toHaveTextContent('Network down');
    expect(screen.queryByRole('main')).not.toBeInTheDocument();
  });
});
