import { render, screen, within } from '@testing-library/react';
import { EducationSection } from '@/features/education/EducationSection';

describe('EducationSection', () => {
  it('renders each education entry with degree, institution, dates and description', () => {
    render(
      <EducationSection
        id="education"
        education={[
          {
            id: 'uni',
            degree: 'BSc Computer Science',
            institution: 'Tech University',
            period: { start: '2014-10', end: '2018-06' },
            description: 'Thesis on compilers',
          },
        ]}
        now={new Date(Date.UTC(2024, 0, 1))}
      />,
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Education' })).toBeInTheDocument();
    const list = within(screen.getByRole('list', { name: 'Education history' }));
    expect(
      list.getByRole('heading', { level: 3, name: 'BSc Computer Science' }),
    ).toBeInTheDocument();
    expect(list.getByText('Tech University')).toBeInTheDocument();
    expect(list.getByText('Oct 2014 – Jun 2018')).toBeInTheDocument();
    expect(list.getByText('3 yrs 9 mos')).toBeInTheDocument();
    expect(list.getByText('Thesis on compilers')).toBeInTheDocument();
  });
});
