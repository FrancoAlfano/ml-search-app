import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage.jsx';
import '@testing-library/jest-dom';

describe('ErrorMessage', () => {
  it('renders the error message', () => {
    const errorMessage = 'An error occurred';
    render(<ErrorMessage message={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('applies the correct class to the error message', () => {
    const errorMessage = 'An error occurred';
    render(<ErrorMessage message={errorMessage} />);

    const messageElement = screen.getByText(errorMessage);
    expect(messageElement.closest('div')).toHaveClass('error-message');
  });
});
