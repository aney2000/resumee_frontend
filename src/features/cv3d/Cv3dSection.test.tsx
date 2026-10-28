import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { TimelineEntry } from '@/domain/timeline';
import { Cv3dSection } from '@/features/cv3d/Cv3dSection';
import type { JourneyCanvasProps } from '@/features/cv3d/scene/JourneyCanvas';

vi.mock('./scene/JourneyCanvas', () => ({
  default: ({ milestones, selectedId }: JourneyCanvasProps) => (
    <div data-testid="journey-canvas" data-count={milestones.length} data-selected={selectedId} />
  ),
}));

const entry = (id: string, kind: TimelineEntry['kind'], start: string): TimelineEntry => ({
  id,
  kind,
  title: `Title ${id}`,
  subtitle: `Sub ${id}`,
  start,
  description: `Desc ${id}`,
});

// Newest first, as produced by buildTimeline.
const entries = [
  entry('c', 'project', '2022-01'),
  entry('b', 'education', '2019-09'),
  entry('a', 'experience', '2017-02'),
];

const yes = () => true;
const no = () => false;
const panel = () => within(screen.getByTestId('milestone-panel'));

describe('Cv3dSection', () => {
  it('renders the fallback list oldest first with the first milestone selected', () => {
    render(<Cv3dSection id="journey" entries={entries} canUseWebGL={no} />);

    expect(screen.getByRole('heading', { name: 'My journey in 3D' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'My journey in 3D' })).toHaveAttribute(
      'data-print',
      'hide',
    );
    const items = within(screen.getByRole('list', { name: 'Milestones' })).getAllByRole('button');
    expect(items.map((item) => item.textContent)).toEqual(['Title a', 'Title b', 'Title c']);
    expect(items[0]).toHaveAttribute('aria-current', 'true');
    expect(panel().getByRole('heading', { name: 'Title a' })).toBeInTheDocument();
    expect(screen.queryByTestId('journey-canvas')).not.toBeInTheDocument();
  });

  it('updates the panel via buttons, keys and list clicks', async () => {
    const user = userEvent.setup();
    render(<Cv3dSection id="journey" entries={entries} canUseWebGL={no} />);

    await user.click(screen.getByRole('button', { name: 'Next milestone' }));
    expect(panel().getByRole('heading', { name: 'Title b' })).toBeInTheDocument();
    expect(screen.getByText('Milestone 2 of 3')).toBeInTheDocument();

    screen.getByRole('group', { name: /arrow keys/ }).focus();
    await user.keyboard('{ArrowRight}');
    expect(panel().getByRole('heading', { name: 'Title c' })).toBeInTheDocument();
    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(panel().getByRole('heading', { name: 'Title a' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Title c' }));
    expect(panel().getByRole('heading', { name: 'Title c' })).toBeInTheDocument();
  });

  it('filters the milestones by kind', async () => {
    const user = userEvent.setup();
    render(<Cv3dSection id="journey" entries={entries} canUseWebGL={no} />);

    await user.click(screen.getByRole('button', { name: 'Education' }));
    const items = within(screen.getByRole('list', { name: 'Milestones' })).getAllByRole('button');
    expect(items.map((item) => item.textContent)).toEqual(['Title a', 'Title c']);
    expect(screen.getByText('Milestone 1 of 2')).toBeInTheDocument();
  });

  it('lazily renders the 3D journey when capable', async () => {
    render(<Cv3dSection id="journey" entries={entries} canUseWebGL={yes} />);

    const canvas = await screen.findByTestId('journey-canvas');
    expect(canvas).toHaveAttribute('data-count', '3');
    expect(canvas).toHaveAttribute('data-selected', 'a');
  });
});
