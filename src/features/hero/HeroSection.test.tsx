import { render, screen } from '@testing-library/react';
import { HeroSection } from '@/features/hero/HeroSection';
import { createProfile } from '@/test/profileFixture';

const identity = {
  ...createProfile().identity,
  fullName: 'Ada Lovelace',
  headline: 'Analytical Engine Programmer',
  location: 'London, UK',
  summary: 'First to publish an algorithm.',
  socials: [{ label: 'GitHub', url: 'https://github.com/ada', kind: 'github' as const }],
};

describe('HeroSection', () => {
  it('renders a region labelled by the full name heading', () => {
    render(<HeroSection identity={identity} />);

    const region = screen.getByRole('region', { name: 'Ada Lovelace' });
    expect(region).toContainElement(
      screen.getByRole('heading', { level: 1, name: 'Ada Lovelace' }),
    );
  });

  it('shows headline, location and summary', () => {
    render(<HeroSection identity={identity} />);

    expect(screen.getByText('Analytical Engine Programmer')).toBeInTheDocument();
    expect(screen.getByText('London, UK')).toBeInTheDocument();
    expect(screen.getByText('First to publish an algorithm.')).toBeInTheDocument();
  });

  it('shows the social links', () => {
    render(<HeroSection identity={identity} />);

    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument();
  });

  it('renders the visual slot when provided', () => {
    render(<HeroSection identity={identity} visual={<p>3D badge</p>} />);

    expect(screen.getByText('3D badge')).toBeInTheDocument();
  });
});
