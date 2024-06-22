import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SearchBox from './SearchBox';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

jest.mock('react-icons/fa', () => ({
  FaSearch: () => <svg data-testid="search-icon"></svg>
}));

describe('SearchBox', () => {
  let mockRouter;

  beforeEach(() => {
    mockRouter = { push: jest.fn() };
    useRouter.mockReturnValue(mockRouter);
  });

  it('renders the search box with input and button', () => {
    render(<SearchBox />);
    expect(
      screen.getByPlaceholderText('Nunca dejes de buscar')
    ).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  it('updates the query state on input change', async () => {
    render(<SearchBox />);
    const input = screen.getByPlaceholderText('Nunca dejes de buscar');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'test query' } });
    });

    expect(input).toHaveValue('test query');
  });

  it('navigates to search results on form submit with query', async () => {
    render(<SearchBox />);
    const input = screen.getByPlaceholderText('Nunca dejes de buscar');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'test query' } });
      fireEvent.submit(screen.getByRole('button'));
    });

    expect(mockRouter.push).toHaveBeenCalledWith('/items?search=test query');
  });

  it('does not navigate on form submit with empty query', async () => {
    render(<SearchBox />);

    await act(async () => {
      fireEvent.submit(screen.getByRole('button'));
    });

    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('clears the search input when clearSearch is called', async () => {
    const ref = React.createRef();
    render(<SearchBox ref={ref} />);

    const input = screen.getByPlaceholderText('Nunca dejes de buscar');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'test query' } });
    });

    expect(input).toHaveValue('test query');

    act(() => {
      ref.current.clearSearch();
    });

    expect(input).toHaveValue('');
  });
});
