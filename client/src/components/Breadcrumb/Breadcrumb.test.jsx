import React from 'react';
import { render, screen } from '@testing-library/react';
import Breadcrumb from './Breadcrumb.jsx';
import '@testing-library/jest-dom';

describe('Breadcrumb', () => {
  it('renders categories with correct links', () => {
    const categories = ['Electronics', 'Laptops', 'Gaming Laptops'];
    render(<Breadcrumb categories={categories} />);

    categories.forEach((category, index) => {
      const linkElement = screen.getByText(category);
      expect(linkElement).toBeInTheDocument();
      expect(linkElement.closest('a')).toHaveAttribute(
        'href',
        `/items?search=${category}`
      );

      if (index < categories.length - 1) {
        const separator = linkElement.nextSibling;
        expect(separator).toHaveClass('separator');
        expect(separator).toHaveTextContent('>');
      }
    });
  });

  it('renders without categories', () => {
    render(<Breadcrumb categories={[]} />);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('renders correctly with one category', () => {
    const categories = ['Electronics'];
    render(<Breadcrumb categories={categories} />);

    const linkElement = screen.getByText('Electronics');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.closest('a')).toHaveAttribute(
      'href',
      '/items?search=Electronics'
    );
    expect(screen.queryByText('>')).not.toBeInTheDocument();
  });
});
