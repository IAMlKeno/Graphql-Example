import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import React, { useEffect } from 'react';
import SignOutButton from '../SignOutButton';
import { UserProvider, useUser } from '~/context/UserProvider';

function Seeded({ onUser }: { onUser?: (u: any) => void }) {
  const { setUser, user } = useUser();
  useEffect(() => {
    setUser({ id: '1', fname: 'Alice', lname: 'Smith', email: 'alice@test.com', dob: 0 });
  }, []);
  useEffect(() => {
    onUser?.(user);
  }, [user]);
  return <SignOutButton />;
}

describe('SignOutButton', () => {
  it('renders a Sign Out button', () => {
    render(<UserProvider><Seeded /></UserProvider>);
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
  });

  it('clears the user from context when clicked', async () => {
    const users: any[] = [];
    render(<UserProvider><Seeded onUser={(u) => users.push(u)} /></UserProvider>);
    await userEvent.click(screen.getByRole('button', { name: /sign out/i }));
    expect(users.at(-1)).toBeNull();
  });
});
