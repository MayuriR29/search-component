import { vi, test, expect, describe } from 'vitest';
import '@testing-library/jest-dom/vitest'
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputSelect from './InputSelect';

vi.mock('../services/listData', () => ({
  fetchCustomerData: vi.fn(() => Promise.resolve([
    { id: 1, firstName: "Emily", lastName: "Johnson", age: 28, address: { city: "Phoenix" } },
    { id: 2, firstName: "James", lastName: "Jaack", age: 29, address: { city: "Phoenix" } },
  ])),
}));

describe('InputSelect', () => {
  test('renders input field', () => {
    render(<InputSelect />);
    const input = screen.getByText(/Search/i);
    expect(input).toBeInTheDocument();
  });

  test('test onchange input field', () => {
    render(<InputSelect />);
    const input = screen.getByLabelText("Search");
    fireEvent.change(input, { target: { value: 'emily' } });
    expect(input).toHaveValue('emily')
  });

  test('test onchange input field, press Enter key', async () => {
    render(<InputSelect />);
    const input = screen.getByLabelText("Search");
    await userEvent.type(input, 'emily');
    await userEvent.keyboard('{Enter}');
    expect(input).not.toHaveValue('emily');
  });

  test('test remove filter', async () => {
    render(<InputSelect />);
    const input = screen.getByLabelText("Search");
    await userEvent.type(input, 'emily');
    await userEvent.keyboard('{Enter}');
    const button = screen.getByRole('button', { name: /Emily/i }); // Case-insensitive match for button text
    expect(button).toBeInTheDocument();
    button.click(button);
  });

});