import { render, screen } from '@testing-library/react';
import ReadApp from './ReadApp';

test('renders learn react link', () => {
  render(<ReadApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
