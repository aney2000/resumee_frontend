import { render, screen, within } from '@testing-library/react';
import { CoursesSection } from '@/features/courses/CoursesSection';
import type { Course } from '@/domain/profile';

const courses: Course[] = [
  { id: 'old', title: 'Old Course', provider: 'Udemy', completedOn: '2020-03', skills: ['CSS'] },
  {
    id: 'new',
    title: 'New Course',
    provider: 'Coursera',
    completedOn: '2023-07',
    certificateUrl: 'https://cert.example.com',
    skills: ['React'],
  },
];

describe('CoursesSection', () => {
  it('lists courses newest first with provider and completion date', () => {
    render(<CoursesSection id="courses" courses={courses} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Courses' })).toBeInTheDocument();
    const items = within(screen.getByRole('list', { name: 'Completed courses' })).getAllByRole(
      'heading',
      { level: 3 },
    );
    expect(items.map((h) => h.textContent)).toEqual(['New Course', 'Old Course']);
    expect(screen.getByText('Coursera')).toBeInTheDocument();
    expect(screen.getByText('Jul 2023')).toHaveAttribute('dateTime', '2023-07');
  });

  it('shows skills and a certificate link only when available', () => {
    render(<CoursesSection id="courses" courses={courses} />);

    expect(screen.getByRole('list', { name: 'Skills from New Course' })).toBeInTheDocument();
    const links = screen.getAllByRole('link', { name: /certificate/i });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAccessibleName('View certificate for New Course');
    expect(links[0]).toHaveAttribute('href', 'https://cert.example.com');
  });
});
