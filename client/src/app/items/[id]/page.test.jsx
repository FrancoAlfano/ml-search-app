import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import ProductDetail from './page';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useParams: jest.fn()
}));

// Mock the axios module
jest.mock('axios');

// Mock the next/head component
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }) => <>{children}</>
  };
});

// Mock the next/link component
jest.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ children, href }) => <a href={href}>{children}</a>
  };
});

// Mock the child components
jest.mock(
  '../../../components/ItemImage/ItemImage',
  () =>
    function MockItemImage({ src, alt }) {
      return <img src={src} alt={alt} data-testid="item-image" />;
    }
);
jest.mock(
  '../../../components/Spinner/LoadingSpinner',
  () =>
    function MockLoadingSpinner() {
      return <div data-testid="loading-spinner">Loading...</div>;
    }
);
jest.mock(
  '../../../components/Error/ErrorMessage',
  () =>
    function MockErrorMessage({ message }) {
      return <div data-testid="error-message">{message}</div>;
    }
);
jest.mock(
  '../../../components/Breadcrumb/Breadcrumb',
  () =>
    function MockBreadcrumb() {
      return <div data-testid="breadcrumb">Breadcrumb</div>;
    }
);

// Mock the formatCurrency utility function
jest.mock('../../../utils/formatCurrency', () => ({
  formatCurrency: jest.fn((amount, currency) => `${currency}${amount}`)
}));

describe('ProductDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.scrollTo = jest.fn();
  });

  it('renders loading state initially', async () => {
    require('next/navigation').useParams.mockReturnValue({ id: '123' });
    axios.get.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve({ data: {} }), 100))
    );

    await act(async () => {
      render(<ProductDetail />);
    });

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  });

  it('renders error message when API call fails', async () => {
    require('next/navigation').useParams.mockReturnValue({ id: '123' });
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    await act(async () => {
      render(<ProductDetail />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'Failed to load product details.'
      );
    });
  });

  it('renders "No product found" when API returns null', async () => {
    require('next/navigation').useParams.mockReturnValue({ id: '123' });
    axios.get.mockResolvedValueOnce({ data: { item: null } });

    await act(async () => {
      render(<ProductDetail />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'No product found.'
      );
    });
  });

  it('renders product details when API call is successful', async () => {
    require('next/navigation').useParams.mockReturnValue({ id: '123' });
    const mockProduct = {
      item: {
        id: '123',
        title: 'Test Product',
        price: { amount: 100, currency: 'USD' },
        picture: 'test.jpg',
        condition: 'new',
        sold_quantity: 10,
        description: 'Test description',
        permalink: 'http://test.com'
      },
      categories: ['Category 1', 'Category 2']
    };
    axios.get.mockResolvedValueOnce({ data: mockProduct });

    await act(async () => {
      render(<ProductDetail />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('USD100')).toBeInTheDocument();
      expect(screen.getByText('new - 10 vendidos')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
      expect(screen.getByText('Comprar')).toBeInTheDocument();
      expect(screen.getByTestId('item-image')).toHaveAttribute(
        'src',
        'test.jpg'
      );
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });
  });

  it('handles missing price gracefully', async () => {
    require('next/navigation').useParams.mockReturnValue({ id: '123' });
    const mockProduct = {
      item: {
        id: '123',
        title: 'Test Product',
        picture: 'test.jpg',
        condition: 'new',
        sold_quantity: 10,
        description: 'Test description',
        permalink: 'http://test.com'
      },
      categories: ['Category 1', 'Category 2']
    };
    axios.get.mockResolvedValueOnce({ data: mockProduct });

    await act(async () => {
      render(<ProductDetail />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.queryByText(/USD/)).not.toBeInTheDocument();
    });
  });

  it('handles missing permalink gracefully', async () => {
    require('next/navigation').useParams.mockReturnValue({ id: '123' });
    const mockProduct = {
      item: {
        id: '123',
        title: 'Test Product',
        price: { amount: 100, currency: 'USD' },
        picture: 'test.jpg',
        condition: 'new',
        sold_quantity: 10,
        description: 'Test description'
      },
      categories: ['Category 1', 'Category 2']
    };
    axios.get.mockResolvedValueOnce({ data: mockProduct });

    await act(async () => {
      render(<ProductDetail />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.queryByText('Comprar')).not.toBeInTheDocument();
    });
  });

  it('scrolls to top on component mount', async () => {
    require('next/navigation').useParams.mockReturnValue({ id: '123' });
    axios.get.mockResolvedValueOnce({ data: { item: {} } });

    await act(async () => {
      render(<ProductDetail />);
    });

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('does not fetch product when id is not provided', async () => {
    require('next/navigation').useParams.mockReturnValue({});

    await act(async () => {
      render(<ProductDetail />);
    });

    expect(axios.get).not.toHaveBeenCalled();
  });
});
