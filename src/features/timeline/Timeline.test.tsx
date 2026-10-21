import { render, screen, within } from '@testing-library/react';
import { Timeline, type TimelineItem } from '@/features/timeline/Timeline';

const items: TimelineItem[] = [
  {
    id: 'a',
    title: 'Engineer',
    subtitle: 'Acme',
    period: 'Jan 2020 – Present',
    duration: '2 yrs',
    description: 'Built things',
    details: <p>Extra detail</p>,
  },
  { id: 'b', title: 'Intern', subtitle: 'Beta', period: '2019', description: 'Learned' },
];

describe('Timeline', () => {
  it('renders a labelled ordered list with one entry per item', () => {
    render(<Timeline label="Career" items={items} />);

    const list = screen.getByRole('list', { name: 'Career' });
    expect(list.tagName).toBe('OL');
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
  });

  it('shows title, subtitle, period, duration, description and details', () => {
    render(<Timeline label="Career" items={items} />);

    const [first] = screen.getAllByRole('listitem') as [HTMLElement];
    const entry = within(first);
    expect(entry.getByRole('heading', { level: 3, name: 'Engineer' })).toBeInTheDocument();
    expect(entry.getByText('Acme')).toBeInTheDocument();
    expect(entry.getByText('Jan 2020 – Present')).toBeInTheDocument();
    expect(entry.getByText('2 yrs')).toBeInTheDocument();
    expect(entry.getByText('Built things')).toBeInTheDocument();
    expect(entry.getByText('Extra detail')).toBeInTheDocument();
  });

  it('omits the duration when not provided', () => {
    render(<Timeline label="Career" items={items} />);

    const [, second] = screen.getAllByRole('listitem') as [HTMLElement, HTMLElement];
    expect(within(second).queryByText('2 yrs')).not.toBeInTheDocument();
  });
});
