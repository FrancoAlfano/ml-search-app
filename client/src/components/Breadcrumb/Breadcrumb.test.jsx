import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Breadcrumb from './Breadcrumb.jsx';
import { SearchProvider } from '../../contexts/SearchContext';
import '@testing-library/jest-dom';

jest.mock('../../contexts/SearchContext', () => ({
  useSearch: jest.fn(),
  SearchProvider: ({ children }) => <>{children}</>
}));

const renderWithSearchContext = (
  ui,
  { providerProps, ...renderOptions } = {}
) => {
  return render(
    <SearchProvider {...providerProps}>{ui}</SearchProvider>,
    renderOptions
  );
};

describe('Breadcrumb', () => {
  const mockSetSearchQuery = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    require('../../contexts/SearchContext').useSearch.mockReturnValue({
      setSearchQuery: mockSetSearchQuery
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders categories with correct links', () => {
    const categories = ['Electronics', 'Laptops', 'Gaming Laptops'];
    renderWithSearchContext(<Breadcrumb categories={categories} />);

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
    renderWithSearchContext(<Breadcrumb categories={[]} />);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('renders correctly with one category', () => {
    const categories = ['Electronics'];
    renderWithSearchContext(<Breadcrumb categories={categories} />);

    const linkElement = screen.getByText('Electronics');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.closest('a')).toHaveAttribute(
      'href',
      '/items?search=Electronics'
    );
    expect(screen.queryByText('>')).not.toBeInTheDocument();
  });

  it('calls setSearchQuery when a breadcrumb is clicked', () => {
    const categories = ['Electronics', 'Laptops'];
    renderWithSearchContext(<Breadcrumb categories={categories} />);

    const laptopLink = screen.getByText('Laptops');
    fireEvent.click(laptopLink);

    expect(mockSetSearchQuery).toHaveBeenCalledWith('Laptops');
  });
});
