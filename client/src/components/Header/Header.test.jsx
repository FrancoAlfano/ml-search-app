import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header.jsx';
import '@testing-library/jest-dom';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, ...rest }) => <a {...rest}>{children}</a>
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: props => <img {...props} />
}));

jest.mock('../SearchBox/SearchBox', () =>
  React.forwardRef((props, ref) => (
    <div ref={ref} data-testid="search-box">
      SearchBox
    </div>
  ))
);

describe('Header', () => {
  it('renders the header with logo and SearchBox', () => {
    render(<Header />);

    const logo = screen.getByAltText('Mercado Libre');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/ml-icon.png');
    expect(logo).toHaveAttribute('width', '50');
    expect(logo).toHaveAttribute('height', '35');

    const searchBox = screen.getByTestId('search-box');
    expect(searchBox).toBeInTheDocument();
  });

  it('clears the search box when logo is clicked', () => {
    render(<Header />);

    const searchBox = screen.getByTestId('search-box');
    searchBox.clearSearch = jest.fn();

    const logoLink = screen.getByRole('link', { name: /mercado libre/i });
    fireEvent.click(logoLink);

    expect(searchBox.clearSearch).toHaveBeenCalled();
  });
});
