import React from 'react';
import { render, screen } from '@testing-library/react';
import ItemCard from './ItemCard';
import '@testing-library/jest-dom';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, ...rest }) => <a {...rest}>{children}</a>
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ ...props }) => (
    <svg data-testid="free-shipping-icon" {...props}></svg>
  )
}));

jest.mock('../../utils/formatCurrency', () => ({
  formatCurrency: (amount, currency) => `${currency} ${amount}`
}));

jest.mock('../ItemImage/ItemImage', () => ({
  __esModule: true,
  default: ({ src, alt, size }) => <img src={src} alt={alt} className={size} />
}));

describe('ItemCard', () => {
  const mockItem = {
    id: '1',
    picture: '/item.jpg',
    title: 'Test Item',
    price: {
      amount: 100,
      currency: 'USD'
    },
    free_shipping: true,
    location: 'Test Location'
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders item details correctly', () => {
    render(<ItemCard item={mockItem} />);

    expect(screen.getByAltText('Test Item')).toHaveAttribute(
      'src',
      '/item.jpg'
    );
    expect(screen.getByText('USD 100')).toBeInTheDocument();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/items/1');
  });

  it('renders free shipping icon when applicable', () => {
    render(<ItemCard item={mockItem} />);

    expect(screen.getByTestId('free-shipping-icon')).toBeInTheDocument();
  });

  it('does not render free shipping icon when not applicable', () => {
    const itemWithoutFreeShipping = { ...mockItem, free_shipping: false };
    render(<ItemCard item={itemWithoutFreeShipping} />);

    expect(screen.queryByTestId('free-shipping-icon')).not.toBeInTheDocument();
  });
});
