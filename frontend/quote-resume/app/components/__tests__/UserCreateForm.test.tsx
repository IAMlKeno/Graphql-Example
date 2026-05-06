import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { UserCreateForm } from '../forms/UserCreateForm';
import { UserProvider } from '~/context/UserProvider';

const mockAddUser = vi.fn().mockResolvedValue({ data: { addUser: null } });

vi.mock('@apollo/client/react', () => ({
  useMutation: () => [mockAddUser, { loading: false }],
}));

function renderComponent() {
  return render(
    <UserProvider>
      <UserCreateForm />
    </UserProvider>
  );
}

beforeEach(() => {
  mockAddUser.mockClear();
});

describe('UserCreateForm', () => {
  it('renders all form fields', () => {
    renderComponent();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create user/i })).toBeInTheDocument();
  });

  it('updates first name field on input', async () => {
    renderComponent();
    const input = screen.getByPlaceholderText('First Name');
    await userEvent.type(input, 'Alice');
    expect(input).toHaveValue('Alice');
  });

  it('updates last name field on input', async () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Last Name');
    await userEvent.type(input, 'Smith');
    expect(input).toHaveValue('Smith');
  });

  it('updates email field on input', async () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Email');
    await userEvent.type(input, 'alice@test.com');
    expect(input).toHaveValue('alice@test.com');
  });

  it('shows "Email is already in use" when a known email loses focus', async () => {
    renderComponent();
    const emailInput = screen.getByPlaceholderText('Email');
    await userEvent.type(emailInput, 'existing@test.com');
    fireEvent.blur(emailInput);
    expect(await screen.findByText('Email is already in use')).toBeInTheDocument();
  });

  it('shows "Email is available" when a new email loses focus', async () => {
    renderComponent();
    const emailInput = screen.getByPlaceholderText('Email');
    await userEvent.type(emailInput, 'newuser@test.com');
    fireEvent.blur(emailInput);
    expect(await screen.findByText('Email is available')).toBeInTheDocument();
  });

  it('shows no availability message before the email field is blurred', async () => {
    renderComponent();
    const emailInput = screen.getByPlaceholderText('Email');
    await userEvent.type(emailInput, 'someone@test.com');
    expect(screen.queryByText('Email is already in use')).not.toBeInTheDocument();
    expect(screen.queryByText('Email is available')).not.toBeInTheDocument();
  });

  it('calls the addUser mutation with mapped field names on submit', async () => {
    renderComponent();
    await userEvent.type(screen.getByPlaceholderText('First Name'), 'Alice');
    await userEvent.type(screen.getByPlaceholderText('Last Name'), 'Smith');
    await userEvent.type(screen.getByPlaceholderText('Email'), 'alice@test.com');
    fireEvent.change(screen.getByDisplayValue(''), { target: { value: '1990-06-15', name: 'dateOfBirth' } });

    await userEvent.click(screen.getByRole('button', { name: /create user/i }));

    expect(mockAddUser).toHaveBeenCalledWith({
      variables: {
        user: {
          fname: 'Alice',
          lname: 'Smith',
          dob: expect.any(String),
          email: 'alice@test.com',
        },
      },
    });
  });
});
