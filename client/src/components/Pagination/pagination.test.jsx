import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

jest.mock('./pagination.module.scss', () => ({
  pagination: 'pagination',
  active: 'active',
  ellipsis: 'ellipsis',
}));

describe('Pagination Component', () => {
  const mockOnPageChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders pagination component', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={10} onPageChange={mockOnPageChange} />
    );
    expect(container.firstChild).toHaveClass('pagination');
  });

  it('displays the current page as active', () => {
    const { getByText } = render(
      <Pagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />
    );
    expect(getByText('5').closest('li')).toHaveClass('active');
  });

  it('calls onPageChange when a page number is clicked', () => {
    const { getByText } = render(
      <Pagination currentPage={1} totalPages={10} onPageChange={mockOnPageChange} />
    );
    fireEvent.click(getByText('2'));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('displays "Anterior" button when not on the first page', () => {
    const { getByText } = render(
      <Pagination currentPage={2} totalPages={10} onPageChange={mockOnPageChange} />
    );
    expect(getByText('< Anterior')).toBeInTheDocument();
  });

  it('does not display "Anterior" button on the first page', () => {
    const { queryByText } = render(
      <Pagination currentPage={1} totalPages={10} onPageChange={mockOnPageChange} />
    );
    expect(queryByText('< Anterior')).not.toBeInTheDocument();
  });

  it('displays "Siguiente" button when not on the last page', () => {
    const { getByText } = render(
      <Pagination currentPage={9} totalPages={10} onPageChange={mockOnPageChange} />
    );
    expect(getByText('Siguiente >')).toBeInTheDocument();
  });

  it('does not display "Siguiente" button on the last page', () => {
    const { queryByText } = render(
      <Pagination currentPage={10} totalPages={10} onPageChange={mockOnPageChange} />
    );
    expect(queryByText('Siguiente >')).not.toBeInTheDocument();
  });

  it('calls onPageChange with previous page when "Anterior" is clicked', () => {
    const { getByText } = render(
      <Pagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />
    );
    fireEvent.click(getByText('< Anterior'));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange with next page when "Siguiente" is clicked', () => {
    const { getByText } = render(
      <Pagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />
    );
    fireEvent.click(getByText('Siguiente >'));
    expect(mockOnPageChange).toHaveBeenCalledWith(6);
  });

  it('always displays first and last page numbers', () => {
    const { getByText } = render(
      <Pagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />
    );
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('10')).toBeInTheDocument();
  });

  it('displays ellipsis when there are many pages', () => {
    const { getAllByText } = render(
      <Pagination currentPage={5} totalPages={20} onPageChange={mockOnPageChange} />
    );
    const ellipses = getAllByText('...');
    expect(ellipses.length).toBeGreaterThan(0);
  });

  it('handles single page scenario', () => {
    const { queryByText } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={mockOnPageChange} />
    );
    expect(queryByText('1')).toBeInTheDocument();
    expect(queryByText('< Anterior')).not.toBeInTheDocument();
    expect(queryByText('Siguiente >')).not.toBeInTheDocument();
  });

  it('displays a range of pages around the current page', () => {
    const { getByText } = render(
      <Pagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />
    );
    [3, 4, 5, 6, 7].forEach(num => {
      expect(getByText(num.toString())).toBeInTheDocument();
    });
  });
});