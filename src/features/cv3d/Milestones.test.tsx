import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { TimelineEntry } from '@/domain/timeline';
import { MilestoneControls } from '@/features/cv3d/MilestoneControls';
import { MilestonePanel } from '@/features/cv3d/MilestonePanel';

const entry: TimelineEntry = {
  id: 'x',
  kind: 'experience',
  title: 'Engineer',
  subtitle: 'Acme',
  start: '2020-01',
  end: '2022-03',
  description: 'Built things.',
};

describe('MilestonePanel', () => {
  it('announces the selected entry politely', () => {
    render(<MilestonePanel entry={entry} />);
    const panel = screen.getByTestId('milestone-panel');
    expect(panel).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Engineer' })).toBeInTheDocument();
    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(screen.getByText('Jan 2020 – Mar 2022')).toBeInTheDocument();
    expect(screen.getByText('Built things.')).toBeInTheDocument();
  });

  it('shows Present for ongoing entries', () => {
    render(<MilestonePanel entry={{ ...entry, end: undefined }} />);
    expect(screen.getByText('Jan 2020 – Present')).toBeInTheDocument();
  });

  it('renders an empty state without an entry', () => {
    render(<MilestonePanel entry={undefined} />);
    expect(screen.getByText('No milestone selected')).toBeInTheDocument();
  });
});

describe('MilestoneControls', () => {
  const setup = () => {
    const props = {
      position: 3,
      total: 12,
      activeKinds: ['experience', 'project'] as const,
      onPrev: vi.fn(),
      onNext: vi.fn(),
      onToggleKind: vi.fn(),
    };
    render(<MilestoneControls {...props} />);
    return props;
  };

  it('shows the position and navigates', async () => {
    const user = userEvent.setup();
    const props = setup();
    expect(screen.getByText('Milestone 3 of 12')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Previous milestone' }));
    await user.click(screen.getByRole('button', { name: 'Next milestone' }));
    expect(props.onPrev).toHaveBeenCalledTimes(1);
    expect(props.onNext).toHaveBeenCalledTimes(1);
  });

  it('renders a pressed toggle per kind', async () => {
    const user = userEvent.setup();
    const props = setup();
    expect(screen.getByRole('button', { name: 'Experience' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    const education = screen.getByRole('button', { name: 'Education' });
    expect(education).toHaveAttribute('aria-pressed', 'false');
    await user.click(education);
    expect(props.onToggleKind).toHaveBeenCalledWith('education');
    expect(screen.getAllByTestId('kind-swatch')).toHaveLength(4);
  });
});
