import { render, screen, within } from '@testing-library/react';
import { SiteNav } from '@/features/navigation/SiteNav';

const items = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
];

describe('SiteNav', () => {
  it('renders a primary navigation with an anchor link per item', () => {
    render(<SiteNav items={items} />);

    const nav = screen.getByRole('navigation', { name: 'Primary' });
    const links = within(nav).getAllByRole('link');
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['#about', '#experience']);
    expect(within(nav).getByRole('link', { name: 'Experience' })).toBeInTheDocument();
  });

  it('offers a skip link to the main content', () => {
    render(<SiteNav items={items} />);

    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
      'href',
      '#content',
    );
  });

  it('is left out of the printed CV', () => {
    render(<SiteNav items={items} />);

    expect(screen.getByRole('banner')).toHaveAttribute('data-print', 'hide');
  });
});
