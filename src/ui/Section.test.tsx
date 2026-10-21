import { render, screen } from '@testing-library/react';
import { Section } from '@/ui/Section';

describe('Section', () => {
  it('renders a region with the given id, labelled by its h2 title', () => {
    render(
      <Section id="experience" title="Experience">
        <p>content</p>
      </Section>,
    );

    const region = screen.getByRole('region', { name: 'Experience' });
    expect(region).toHaveAttribute('id', 'experience');
    expect(screen.getByRole('heading', { level: 2, name: 'Experience' })).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('renders an optional eyebrow', () => {
    render(
      <Section id="skills" title="Skills" eyebrow="What I use">
        <p>content</p>
      </Section>,
    );

    expect(screen.getByText('What I use')).toBeInTheDocument();
  });
});
