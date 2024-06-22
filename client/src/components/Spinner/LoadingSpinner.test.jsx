import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders the loading spinner', () => {
    render(<LoadingSpinner />);

    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toBeInTheDocument();

    expect(spinnerElement).toHaveClass('spinner');
  });
});
