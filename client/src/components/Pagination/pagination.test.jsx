import React from 'react';
import { render, fireEvent, screen, within } from '@testing-library/react';
import Pagination from './Pagination';

jest.mock('./pagination.module.scss', () => ({
  pagination: 'pagination',
  active: 'active',
  ellipsis: 'ellipsis',
  desktopVisible: 'desktopVisible',
  mobileVisible: 'mobileVisible'
}));

describe('Pagination Component', () => {
  const mockOnPageChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders pagination component', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    expect(container.firstChild).toHaveClass('pagination');
  });

  it('displays the current page as active in desktop view', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    const desktopView = screen
      .getByRole('navigation')
      .querySelector('.desktopVisible');
    const activeButton = within(desktopView).getByText('5').closest('li');
    expect(activeButton).toHaveClass('active');
  });

  it('calls onPageChange when a page number is clicked', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    const desktopView = screen
      .getByRole('navigation')
      .querySelector('.desktopVisible');
    fireEvent.click(within(desktopView).getByText('2'));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('displays "Anterior" button when not on the first page', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    expect(screen.getByText('< Anterior')).toBeInTheDocument();
  });

  it('does not display "Anterior" button on the first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    expect(screen.queryByText('< Anterior')).not.toBeInTheDocument();
  });

  it('displays "Siguiente" button when not on the last page', () => {
    render(
      <Pagination
        currentPage={9}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    expect(screen.getByText('Siguiente >')).toBeInTheDocument();
  });

  it('does not display "Siguiente" button on the last page', () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    expect(screen.queryByText('Siguiente >')).not.toBeInTheDocument();
  });

  it('calls onPageChange with previous page when "Anterior" is clicked', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    fireEvent.click(screen.getByText('< Anterior'));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange with next page when "Siguiente" is clicked', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    fireEvent.click(screen.getByText('Siguiente >'));
    expect(mockOnPageChange).toHaveBeenCalledWith(6);
  });

  it('always displays first and last page numbers for many pages', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={20}
        onPageChange={mockOnPageChange}
      />
    );
    const desktopView = screen
      .getByRole('navigation')
      .querySelector('.desktopVisible');
    expect(within(desktopView).getByText('1')).toBeInTheDocument();
    expect(within(desktopView).getByText('20')).toBeInTheDocument();
  });

  it('displays ellipsis when there are many pages', () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={20}
        onPageChange={mockOnPageChange}
      />
    );
    const ellipses = screen.getAllByText('...');
    expect(ellipses.length).toBe(2);
  });

  it('handles single page scenario', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />
    );
    const desktopView = screen
      .getByRole('navigation')
      .querySelector('.desktopVisible');
    expect(within(desktopView).getByText('1')).toBeInTheDocument();
    expect(screen.queryByText('< Anterior')).not.toBeInTheDocument();
    expect(screen.queryByText('Siguiente >')).not.toBeInTheDocument();
  });

  it('displays a range of pages around the current page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    const desktopView = screen
      .getByRole('navigation')
      .querySelector('.desktopVisible');
    [2, 3, 4, 5, 6, 7, 8].forEach(num => {
      expect(within(desktopView).getByText(num.toString())).toBeInTheDocument();
    });
  });

  it('displays mobile view with only current page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    const mobileView = screen
      .getByRole('navigation')
      .querySelector('.mobileVisible');
    expect(mobileView).toHaveTextContent('5');
    expect(mobileView).toHaveClass('active');
  });

  it('displays desktop view with page range', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    const desktopView = screen
      .getByRole('navigation')
      .querySelector('.desktopVisible');
    expect(desktopView).toBeInTheDocument();
    expect(within(desktopView).getByText('2')).toBeInTheDocument();
    expect(within(desktopView).getByText('8')).toBeInTheDocument();
  });
});