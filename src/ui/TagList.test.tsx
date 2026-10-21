import { render, screen, within } from '@testing-library/react';
import { TagList } from '@/ui/TagList';

describe('TagList', () => {
  it('renders a labelled list with one item per tag', () => {
    render(<TagList label="Technologies" tags={['React', 'TypeScript']} />);

    const list = screen.getByRole('list', { name: 'Technologies' });
    expect(
      within(list)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['React', 'TypeScript']);
  });

  it('renders nothing for an empty tag list', () => {
    render(<TagList label="Technologies" tags={[]} />);

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
