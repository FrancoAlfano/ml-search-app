import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SearchBox from './SearchBox';
import { SearchProvider } from '../../contexts/SearchContext';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

jest.mock('react-icons/fa', () => ({
  FaSearch: () => <svg data-testid="search-icon"></svg>
}));

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

describe('SearchBox', () => {
  let mockRouter;
  let mockSetSearchQuery;

  beforeEach(() => {
    mockRouter = { push: jest.fn() };
    useRouter.mockReturnValue(mockRouter);
    mockSetSearchQuery = jest.fn();
    require('../../contexts/SearchContext').useSearch.mockReturnValue({
      searchQuery: '',
      setSearchQuery: mockSetSearchQuery
    });
  });

  it('renders the search box with input and button', () => {
    renderWithSearchContext(<SearchBox />);
    expect(
      screen.getByPlaceholderText('Nunca dejes de buscar')
    ).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  it('updates the query state on input change', async () => {
    renderWithSearchContext(<SearchBox />);
    const input = screen.getByPlaceholderText('Nunca dejes de buscar');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'test query' } });
    });
    expect(mockSetSearchQuery).toHaveBeenCalledWith('test query');
  });

  it('navigates to search results on form submit with query', async () => {
    require('../../contexts/SearchContext').useSearch.mockReturnValue({
      searchQuery: 'test query',
      setSearchQuery: mockSetSearchQuery
    });
    renderWithSearchContext(<SearchBox />);
    await act(async () => {
      fireEvent.submit(screen.getByRole('button').closest('form'));
    });
    expect(mockRouter.push).toHaveBeenCalledWith('/items?search=test query');
  });

  it('does not navigate on form submit with empty query', async () => {
    renderWithSearchContext(<SearchBox />);
    await act(async () => {
      fireEvent.submit(screen.getByRole('button').closest('form'));
    });
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('clears the search input when clearSearch is called', async () => {
    const ref = React.createRef();
    renderWithSearchContext(<SearchBox ref={ref} />);
    act(() => {
      ref.current.clearSearch();
    });
    expect(mockSetSearchQuery).toHaveBeenCalledWith('');
  });
});
