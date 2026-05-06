import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import UserDisplay from '../UserDisplay';
import { UserProvider } from '~/context/UserProvider';

function renderWithUser(user: { fname: string; email: string } | null) {
  const Wrapper = () => {
    const [, setUser] = [null, () => {}];
    return (
      <UserProvider>
        <UserDisplayWithSetter user={user} />
      </UserProvider>
    );
  };

  // Simpler: use a wrapper that seeds the context via state
  const Seeded = () => {
    return <UserDisplayWrapper initialUser={user} />;
  };

  return render(<Seeded />);
}

// Helper that wraps UserDisplay and seeds the context
import React, { useEffect } from 'react';
import { useUser } from '~/context/UserProvider';

function UserDisplayWrapper({ initialUser }: { initialUser: any }) {
  const { setUser } = useUser();
  useEffect(() => {
    setUser(initialUser);
  }, []);
  return <UserDisplay />;
}

function Wrapper({ user }: { user: any }) {
  return (
    <UserProvider>
      <UserDisplayWrapper initialUser={user} />
    </UserProvider>
  );
}

describe('UserDisplay', () => {
  it('shows a greeting with the user first name when user has an email', async () => {
    render(
      <Wrapper user={{ id: '1', fname: 'Alice', lname: 'Smith', email: 'alice@test.com', dob: 0 }} />
    );
    expect(await screen.findByText('Hi Alice')).toBeInTheDocument();
  });

  it('renders nothing when no user is set', () => {
    render(<Wrapper user={null} />);
    expect(screen.queryByText(/Hi/i)).not.toBeInTheDocument();
  });

  it('renders nothing when user has no email', () => {
    render(<Wrapper user={{ id: '1', fname: 'Bob', lname: 'Jones', email: '', dob: 0 }} />);
    expect(screen.queryByText(/Hi/i)).not.toBeInTheDocument();
  });
});
