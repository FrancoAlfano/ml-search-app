import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import SearchResults from './page.jsx';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn()
}));

jest.mock('axios');

jest.mock(
  '../../components/ItemCard/ItemCard',
  () =>
    function MockItemCard({ item }) {
      return <div data-testid="item-card">{item.title}</div>;
    }
);
jest.mock(
  '../../components/Spinner/LoadingSpinner',
  () =>
    function MockLoadingSpinner() {
      return <div data-testid="loading-spinner">Loading...</div>;
    }
);
jest.mock(
  '../../components/Error/ErrorMessage',
  () =>
    function MockErrorMessage({ message }) {
      return <div data-testid="error-message">{message}</div>;
    }
);
jest.mock(
  '../../components/Breadcrumb/Breadcrumb',
  () =>
    function MockBreadcrumb() {
      return <div data-testid="breadcrumb">Breadcrumb</div>;
    }
);

describe('SearchResults', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders loading state initially', async () => {
    const mockSearchParams = new URLSearchParams('?search=test');
    require('next/navigation').useSearchParams.mockReturnValue(
      mockSearchParams
    );

    axios.get.mockImplementationOnce(
      () =>
        new Promise(resolve =>
          setTimeout(
            () => resolve({ data: { items: [], categories: [] } }),
            100
          )
        )
    );

    await act(async () => {
      render(<SearchResults />);
    });

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  });

  it('renders error message when API call fails', async () => {
    const mockSearchParams = new URLSearchParams('?search=test');
    require('next/navigation').useSearchParams.mockReturnValue(
      mockSearchParams
    );

    axios.get.mockRejectedValueOnce(new Error('API Error'));

    await act(async () => {
      render(<SearchResults />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'Error: API Error'
      );
    });
  });

  it('renders no results message when API returns empty array', async () => {
    const mockSearchParams = new URLSearchParams('?search=test');
    require('next/navigation').useSearchParams.mockReturnValue(
      mockSearchParams
    );

    axios.get.mockResolvedValueOnce({ data: { items: [], categories: [] } });

    await act(async () => {
      render(<SearchResults />);
    });

    await waitFor(() => {
      expect(
        screen.getByText('No hay publicaciones que coincidan con tu búsqueda')
      ).toBeInTheDocument();
    });
  });

  it('renders item cards when API returns results', async () => {
    const mockSearchParams = new URLSearchParams('?search=test');
    require('next/navigation').useSearchParams.mockReturnValue(
      mockSearchParams
    );

    const mockItems = [
      { id: '1', title: 'Item 1' },
      { id: '2', title: 'Item 2' }
    ];
    axios.get.mockResolvedValueOnce({
      data: { items: mockItems, categories: ['Category 1'] }
    });

    await act(async () => {
      render(<SearchResults />);
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('item-card')).toHaveLength(2);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });

  it('renders breadcrumb with correct categories', async () => {
    const mockSearchParams = new URLSearchParams('?search=test');
    require('next/navigation').useSearchParams.mockReturnValue(
      mockSearchParams
    );

    axios.get.mockResolvedValueOnce({
      data: { items: [], categories: ['Category 1', 'Category 2'] }
    });

    await act(async () => {
      render(<SearchResults />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });
  });

  it('does not fetch results when search param is empty', async () => {
    const mockSearchParams = new URLSearchParams('');
    require('next/navigation').useSearchParams.mockReturnValue(
      mockSearchParams
    );

    await act(async () => {
      render(<SearchResults />);
    });

    expect(axios.get).not.toHaveBeenCalled();
  });
});
