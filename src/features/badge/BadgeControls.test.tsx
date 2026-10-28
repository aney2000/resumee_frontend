import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BadgeControls } from '@/features/badge/BadgeControls';

describe('BadgeControls', () => {
  it('groups the badge actions under an accessible name', () => {
    render(<BadgeControls onReset={vi.fn()} />);

    expect(screen.getByRole('group', { name: 'Badge controls' })).toBeInTheDocument();
  });

  it('resets the badge', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(<BadgeControls onReset={onReset} />);

    await user.click(screen.getByRole('button', { name: 'Reset badge' }));

    expect(onReset).toHaveBeenCalledOnce();
  });
});
