import { render, screen, within } from '@testing-library/react';
import { ExperienceSection } from '@/features/experience/ExperienceSection';
import type { Experience } from '@/domain/profile';

const experience: Experience = {
  id: 'acme',
  role: 'Frontend Engineer',
  company: 'Acme',
  period: { start: '2020-01' },
  description: 'Built the design system',
  highlights: ['Cut bundle size by 40%'],
  technologies: ['React', 'TypeScript'],
};

const now = new Date(Date.UTC(2021, 2, 15));

describe('ExperienceSection', () => {
  it('renders each experience as a timeline entry with role, company and dates', () => {
    render(<ExperienceSection id="experience" experiences={[experience]} now={now} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Experience' })).toBeInTheDocument();
    const entry = within(screen.getByRole('list', { name: 'Work experience' }));
    expect(entry.getByRole('heading', { level: 3, name: 'Frontend Engineer' })).toBeInTheDocument();
    expect(entry.getByText('Acme')).toBeInTheDocument();
    expect(entry.getByText('Jan 2020 – Present')).toBeInTheDocument();
    expect(entry.getByText('1 yr 3 mos')).toBeInTheDocument();
  });

  it('lists highlights and technologies', () => {
    render(<ExperienceSection id="experience" experiences={[experience]} now={now} />);

    expect(
      within(screen.getByRole('list', { name: 'Highlights at Acme' })).getByText(
        'Cut bundle size by 40%',
      ),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole('list', { name: 'Technologies used at Acme' })).getAllByRole(
        'listitem',
      ),
    ).toHaveLength(2);
  });
});
