import { render, screen } from '@testing-library/react';
import { SocialLinks } from '@/features/hero/SocialLinks';

describe('SocialLinks', () => {
  it('renders one link per social, named by its label', () => {
    render(
      <SocialLinks
        links={[
          { label: 'GitHub', url: 'https://github.com/ada', kind: 'github' },
          { label: 'LinkedIn', url: 'https://linkedin.com/in/ada', kind: 'linkedin' },
        ]}
      />,
    );

    expect(screen.getByRole('list', { name: 'Social links' })).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/ada',
    );
  });

  it('opens external links in a new tab safely', () => {
    render(
      <SocialLinks links={[{ label: 'GitHub', url: 'https://github.com/ada', kind: 'github' }]} />,
    );

    const link = screen.getByRole('link', { name: 'GitHub' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('turns email links into mailto links in the same tab', () => {
    render(<SocialLinks links={[{ label: 'Email', url: 'ada@example.com', kind: 'email' }]} />);

    const link = screen.getByRole('link', { name: 'Email' });
    expect(link).toHaveAttribute('href', 'mailto:ada@example.com');
    expect(link).not.toHaveAttribute('target');
  });

  it('does not double-prefix an existing mailto url', () => {
    render(
      <SocialLinks links={[{ label: 'Email', url: 'mailto:ada@example.com', kind: 'email' }]} />,
    );

    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      'mailto:ada@example.com',
    );
  });

  it('renders nothing when there are no links', () => {
    render(<SocialLinks links={[]} />);

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
