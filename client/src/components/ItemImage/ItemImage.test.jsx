import React from 'react';
import { render, screen } from '@testing-library/react';
import ItemImage from './ItemImage';
import '@testing-library/jest-dom';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  )
}));

describe('ItemImage', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders small item image with correct attributes', () => {
    render(
      <ItemImage src="/test-small.jpg" alt="Test Small Image" size="small" />
    );
    const img = screen.getByAltText('Test Small Image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test-small.jpg');
    expect(img).toHaveAttribute('width', '180');
    expect(img).toHaveAttribute('height', '180');
    expect(img).toHaveClass('item-image');
  });

  it('renders large item image with correct attributes', () => {
    render(
      <ItemImage src="/test-large.jpg" alt="Test Large Image" size="large" />
    );
    const img = screen.getByAltText('Test Large Image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test-large.jpg');
    expect(img).toHaveAttribute('width', '680');
    expect(img).toHaveAttribute('height', '680');
    expect(img).toHaveClass('item-image-large');
  });

  it('renders item image with default size if size prop is not provided', () => {
    render(<ItemImage src="/test-default.jpg" alt="Test Default Image" />);
    const img = screen.getByAltText('Test Default Image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test-default.jpg');
    expect(img).toHaveAttribute('width', '180');
    expect(img).toHaveAttribute('height', '180');
    expect(img).toHaveClass('item-image');
  });
});
