import { render, screen } from '@testing-library/react';
import App from './App';

test('renders LJW find', () => {
	render(<App />);
	const linkElement = screen.getByText(/lee/i);
	expect(linkElement).toBeInTheDocument();
});
