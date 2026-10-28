import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BadgeControls } from '@/features/badge/BadgeControls';

describe('BadgeControls', () => {
  const noop = { onReset: vi.fn(), onCut: vi.fn(), canCut: true };

  it('groups the badge actions under an accessible name', () => {
    render(<BadgeControls {...noop} />);

    expect(screen.getByRole('group', { name: 'Badge controls' })).toBeInTheDocument();
  });

  it('resets the badge', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(<BadgeControls {...noop} onReset={onReset} />);

    await user.click(screen.getByRole('button', { name: 'Reset badge' }));

    expect(onReset).toHaveBeenCalledOnce();
  });

  it('cuts the lanyard', async () => {
    const user = userEvent.setup();
    const onCut = vi.fn();
    render(<BadgeControls {...noop} onCut={onCut} />);

    await user.click(screen.getByRole('button', { name: 'Cut the lanyard' }));

    expect(onCut).toHaveBeenCalledOnce();
  });

  it('disables cutting while the badge is not hanging', () => {
    render(<BadgeControls {...noop} canCut={false} />);

    expect(screen.getByRole('button', { name: 'Cut the lanyard' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Reset badge' })).toBeEnabled();
  });
});
