import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { Badge } from '../../components/atoms/Badge';
import { Card } from '../../components/atoms/Card';

describe('Atomic Components', () => {
  describe('Button', () => {
    it('should render with children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should handle click events', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      await user.click(screen.getByText('Click me'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should apply variant styles', () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      expect(screen.getByText('Primary')).toHaveClass('bg-blue-600');

      rerender(<Button variant="danger">Danger</Button>);
      expect(screen.getByText('Danger')).toHaveClass('bg-red-600');
    });

    it('should apply size styles', () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      expect(screen.getByText('Small')).toHaveClass('px-3');

      rerender(<Button size="lg">Large</Button>);
      expect(screen.getByText('Large')).toHaveClass('px-6');
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByText('Disabled')).toBeDisabled();
    });
  });

  describe('Input', () => {
    it('should render with placeholder', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Input label="Username" />);
      expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('should display error message', () => {
      render(<Input error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should handle value changes', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(handleChange).toHaveBeenCalled();
    });

    it('should apply error styles when error is present', () => {
      render(<Input error="Error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500');
    });
  });

  describe('Badge', () => {
    it('should render status badge', () => {
      render(<Badge type="status" value="todo" />);
      expect(screen.getByText('todo')).toBeInTheDocument();
    });

    it('should render category badge', () => {
      render(<Badge type="category" value="A" />);
      expect(screen.getByText('A')).toBeInTheDocument();
    });

    it('should apply correct color for status', () => {
      const { rerender } = render(<Badge type="status" value="todo" />);
      expect(screen.getByText('todo')).toHaveClass('bg-blue-100');

      rerender(<Badge type="status" value="done" />);
      expect(screen.getByText('done')).toHaveClass('bg-green-100');
    });

    it('should apply correct color for category', () => {
      render(<Badge type="category" value="A" />);
      expect(screen.getByText('A')).toHaveClass('bg-purple-100');
    });
  });

  describe('Card', () => {
    it('should render children', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('should render with title', () => {
      render(<Card title="Card Title">Content</Card>);
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('custom-class');
    });
  });
});
