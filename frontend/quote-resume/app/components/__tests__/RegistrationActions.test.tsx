import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import RegistrationActions from '../RegistrationActions';
import { UserProvider } from '~/context/UserProvider';

// UserSelectForm makes a real fetch — mock it so tests stay offline
vi.mock('~/components/forms/UserSelectForm', () => ({
  UserSelectForm: () => <div>Find Existing User</div>,
}));

vi.mock('~/components/forms/UserCreateForm', () => ({
  UserCreateForm: () => <div>Create New User</div>,
}));

function renderComponent() {
  return render(
    <UserProvider>
      <RegistrationActions />
    </UserProvider>
  );
}

describe('RegistrationActions', () => {
  it('shows neither form on initial render', () => {
    renderComponent();
    expect(screen.queryByText('Find Existing User')).not.toBeInTheDocument();
    expect(screen.queryByText('Create New User')).not.toBeInTheDocument();
  });

  it('shows the sign-in form when Sign In is clicked', async () => {
    renderComponent();
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByText('Find Existing User')).toBeInTheDocument();
    expect(screen.queryByText('Create New User')).not.toBeInTheDocument();
  });

  it('shows the sign-up form when Sign Up is clicked', async () => {
    renderComponent();
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(screen.getByText('Create New User')).toBeInTheDocument();
    expect(screen.queryByText('Find Existing User')).not.toBeInTheDocument();
  });

  it('switches from sign-in to sign-up correctly', async () => {
    renderComponent();
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByText('Find Existing User')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(screen.getByText('Create New User')).toBeInTheDocument();
    expect(screen.queryByText('Find Existing User')).not.toBeInTheDocument();
  });
});
