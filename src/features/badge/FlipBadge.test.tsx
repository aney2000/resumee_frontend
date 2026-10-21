import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FlipBadge } from '@/features/badge/FlipBadge';
import type { BadgeContent } from '@/features/badge/badgeContent';

const content: BadgeContent = {
  front: {
    name: 'Ada Lovelace',
    title: 'Analytical Engine Programmer',
    organization: 'Babbage & Co',
    photoUrl: '/ada.png',
    badgeId: 'AE-1843',
  },
  back: {
    summary: 'First to publish an algorithm.',
    location: 'London, UK',
    contacts: [{ label: 'GitHub', url: 'https://github.com/ada' }],
  },
};

const toggle = () => screen.getByRole('button', { name: 'Flip badge' });
const front = () => screen.getByTestId('badge-front');
const back = () => screen.getByTestId('badge-back');

describe('FlipBadge', () => {
  it('shows the front face with photo, name, title, organization and badge id', () => {
    render(<FlipBadge content={content} />);

    expect(toggle()).toHaveAttribute('aria-pressed', 'false');
    expect(front()).not.toHaveAttribute('aria-hidden');
    expect(back()).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveAttribute('src', '/ada.png');
    expect(front()).toHaveTextContent('Ada Lovelace');
    expect(front()).toHaveTextContent('Analytical Engine Programmer');
    expect(front()).toHaveTextContent('Babbage & Co');
    expect(front()).toHaveTextContent('AE-1843');
  });

  it('renders the back face with summary, location and contacts', () => {
    render(<FlipBadge content={content} />);

    expect(back()).toHaveTextContent('First to publish an algorithm.');
    expect(back()).toHaveTextContent('London, UK');
    expect(back()).toHaveTextContent('GitHub');
  });

  it('flips to the back on click and back again on a second click', async () => {
    const user = userEvent.setup();
    render(<FlipBadge content={content} />);

    await user.click(toggle());

    expect(toggle()).toHaveAttribute('aria-pressed', 'true');
    expect(front()).toHaveAttribute('aria-hidden', 'true');
    expect(back()).not.toHaveAttribute('aria-hidden');
    expect(screen.getByRole('status')).toHaveTextContent('Showing back of badge');

    await user.click(toggle());

    expect(toggle()).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('status')).toHaveTextContent('Showing front of badge');
  });

  it.each(['{Enter}', ' '])('flips with the keyboard (%j)', async (key) => {
    const user = userEvent.setup();
    render(<FlipBadge content={content} />);

    toggle().focus();
    await user.keyboard(key);

    expect(toggle()).toHaveAttribute('aria-pressed', 'true');
  });

  it('falls back to initials when the photo is missing or fails to load', () => {
    const { rerender } = render(
      <FlipBadge content={{ ...content, front: { ...content.front, photoUrl: '' } }} />,
    );
    expect(screen.getByText('AL')).toBeInTheDocument();

    rerender(<FlipBadge content={content} />);
    fireEvent.error(screen.getByRole('img', { name: 'Ada Lovelace' }));
    expect(screen.getByText('AL')).toBeInTheDocument();
  });
});
