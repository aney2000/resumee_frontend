import { render, screen, within } from '@testing-library/react';
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

  it('renders the primary navigation and a skippable main content area', async () => {
    renderApp(resolvingRepository(createProfile()));

    expect(await screen.findByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('id', 'content');
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
      'href',
      '#content',
    );
  });

  it('points every navigation link at a section on the page', async () => {
    const { container } = renderApp(resolvingRepository(createProfile()));

    const nav = await screen.findByRole('navigation', { name: 'Primary' });
    const links = within(nav).getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      const id = link.getAttribute('href')?.slice(1) ?? '';
      expect(container.querySelector(`[id="${id}"]`)).toBeInTheDocument();
    }
  });

  it('shows the hero with the headline', async () => {
    const base = createProfile();
    renderApp(
      resolvingRepository(createProfile({ identity: { ...base.identity, headline: 'Builder' } })),
    );

    expect(await screen.findByText('Builder')).toBeInTheDocument();
  });

  it('shows an error state when loading fails', async () => {
    renderApp(rejectingRepository(new Error('Network down')));

    expect(await screen.findByRole('alert')).toHaveTextContent('Network down');
    expect(screen.queryByRole('main')).not.toBeInTheDocument();
  });
});
