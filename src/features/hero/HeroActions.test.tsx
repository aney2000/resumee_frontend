import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeroActions } from '@/features/hero/HeroActions';

describe('HeroActions', () => {
  it('saves the CV through the print dialog', async () => {
    const user = userEvent.setup();
    const onDownloadCv = vi.fn();
    render(<HeroActions onDownloadCv={onDownloadCv} />);

    await user.click(screen.getByRole('button', { name: 'Download CV' }));

    expect(onDownloadCv).toHaveBeenCalledOnce();
  });

  it('links to the contact address when one is given', () => {
    render(<HeroActions contactHref="mailto:ada@example.com" onDownloadCv={vi.fn()} />);

    expect(screen.getByRole('link', { name: 'Get in touch' })).toHaveAttribute(
      'href',
      'mailto:ada@example.com',
    );
  });

  it('is left out of the printed CV', () => {
    render(<HeroActions onDownloadCv={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Download CV' }).parentElement).toHaveAttribute(
      'data-print',
      'hide',
    );
  });
});
