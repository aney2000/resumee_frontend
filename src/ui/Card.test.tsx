import { render, screen } from '@testing-library/react';
import { Card } from '@/ui/Card';

describe('Card', () => {
  it('renders its children inside an article', () => {
    render(
      <Card>
        <h3>Title</h3>
      </Card>,
    );

    expect(screen.getByRole('article')).toContainElement(
      screen.getByRole('heading', { name: 'Title' }),
    );
  });
});
