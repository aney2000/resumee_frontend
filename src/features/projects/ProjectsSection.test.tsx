import { render, screen, within } from '@testing-library/react';
import { ProjectsSection } from '@/features/projects/ProjectsSection';
import type { Project } from '@/domain/profile';

const projects: Project[] = [
  {
    id: 'cv',
    name: '3D CV',
    description: 'Interactive resume',
    technologies: ['Three.js'],
    url: 'https://cv.example.com',
    repoUrl: 'https://github.com/x/cv',
  },
  { id: 'cli', name: 'Tiny CLI', description: 'A tool', technologies: [] },
];

describe('ProjectsSection', () => {
  it('renders one card per project with name, description and technologies', () => {
    render(<ProjectsSection id="projects" projects={projects} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Side projects' })).toBeInTheDocument();
    const card = within(screen.getByRole('article', { name: '3D CV' }));
    expect(card.getByRole('heading', { level: 3, name: '3D CV' })).toBeInTheDocument();
    expect(card.getByText('Interactive resume')).toBeInTheDocument();
    expect(card.getByRole('list', { name: 'Technologies for 3D CV' })).toBeInTheDocument();
  });

  it('links to the demo and source only when URLs exist', () => {
    render(<ProjectsSection id="projects" projects={projects} />);

    expect(screen.getByRole('link', { name: 'Live demo of 3D CV' })).toHaveAttribute(
      'href',
      'https://cv.example.com',
    );
    expect(screen.getByRole('link', { name: 'Source code for 3D CV' })).toHaveAttribute(
      'href',
      'https://github.com/x/cv',
    );
    expect(
      within(screen.getByRole('article', { name: 'Tiny CLI' })).queryByRole('link'),
    ).not.toBeInTheDocument();
  });
});
