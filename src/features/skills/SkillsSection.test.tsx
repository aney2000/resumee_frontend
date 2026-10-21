import { render, screen, within } from '@testing-library/react';
import { SkillsSection } from '@/features/skills/SkillsSection';

describe('SkillsSection', () => {
  it('renders a labelled group of chips per skill category', () => {
    render(
      <SkillsSection
        id="skills"
        skills={[
          { category: 'Frontend', items: ['React', 'CSS'] },
          { category: 'Tooling', items: ['Vite'] },
        ]}
      />,
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Skills' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Frontend' })).toBeInTheDocument();
    expect(
      within(screen.getByRole('list', { name: 'Frontend skills' })).getAllByRole('listitem'),
    ).toHaveLength(2);
    expect(screen.getByRole('list', { name: 'Tooling skills' })).toHaveTextContent('Vite');
  });
});
