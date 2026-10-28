import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeroBadge } from '@/features/badge/HeroBadge';
import type { BadgeContent } from '@/features/badge/badgeContent';
import type { LanyardCanvasProps } from '@/features/badge/scene/LanyardCanvas';

vi.mock('./scene/LanyardCanvas', () => ({
  default: ({ flipped, generation, onFlip }: LanyardCanvasProps) => (
    <div
      data-testid="lanyard-canvas"
      data-flipped={String(flipped)}
      data-generation={generation}
      onClick={onFlip}
    />
  ),
}));

const content: BadgeContent = {
  front: {
    name: 'Ada Lovelace',
    title: 'Analytical Engine Programmer',
    organization: 'Babbage & Co',
    photoUrl: '',
    badgeId: 'AE-1843',
  },
  back: { summary: 'First algorithm.', location: 'London, UK', contacts: [] },
};

const yes = () => true;
const no = () => false;

describe('HeroBadge', () => {
  it('falls back to the CSS flip badge when WebGL is unavailable', () => {
    render(<HeroBadge content={content} canUseWebGL={no} />);

    expect(screen.getByTestId('badge-front')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Flip badge' })).toBeInTheDocument();
    expect(screen.queryByTestId('lanyard-canvas')).not.toBeInTheDocument();
    expect(screen.queryByText('Drag me · click to flip')).not.toBeInTheDocument();
  });

  it('lazily renders the 3D lanyard with a hint when capable', async () => {
    render(<HeroBadge content={content} canUseWebGL={yes} />);

    const canvas = await screen.findByTestId('lanyard-canvas');
    expect(canvas).toHaveAttribute('data-flipped', 'false');
    expect(screen.getByText('Drag me · click to flip')).toBeInTheDocument();
  });

  it('lets keyboard users flip the 3D badge', async () => {
    const user = userEvent.setup();
    render(<HeroBadge content={content} canUseWebGL={yes} />);
    const canvas = await screen.findByTestId('lanyard-canvas');
    const toggle = screen.getByRole('button', { name: 'Flip badge' });

    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await user.click(toggle);
    expect(canvas).toHaveAttribute('data-flipped', 'true');
    expect(toggle).toHaveAttribute('aria-pressed', 'true');

    await user.click(canvas);
    expect(canvas).toHaveAttribute('data-flipped', 'false');
  });

  it('replaces a stuck badge with a fresh one showing its front', async () => {
    const user = userEvent.setup();
    render(<HeroBadge content={content} canUseWebGL={yes} />);
    const canvas = await screen.findByTestId('lanyard-canvas');
    await user.click(canvas);

    await user.click(screen.getByRole('button', { name: 'Reset badge' }));

    expect(canvas).toHaveAttribute('data-generation', '1');
    expect(canvas).toHaveAttribute('data-flipped', 'false');
  });
});
