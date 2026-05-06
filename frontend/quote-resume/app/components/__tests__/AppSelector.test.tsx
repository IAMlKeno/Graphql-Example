import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import AppSelector from '../AppSelector';
import { AppSelectorProvider, AppTypeEnum } from '~/context/SelectedAppProvider';

function renderComponent() {
  return render(
    <AppSelectorProvider>
      <AppSelector />
    </AppSelectorProvider>
  );
}

describe('AppSelector', () => {
  it('renders both app buttons', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /quote app/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /rick and morty app/i })).toBeInTheDocument();
  });

  it('Quote App button is disabled by default (it is the active app)', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /quote app/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /rick and morty app/i })).not.toBeDisabled();
  });

  it('clicking Rick and Morty disables it and enables Quote App', async () => {
    renderComponent();
    await userEvent.click(screen.getByRole('button', { name: /rick and morty app/i }));
    expect(screen.getByRole('button', { name: /rick and morty app/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /quote app/i })).not.toBeDisabled();
  });

  it('clicking Quote App after Rick and Morty re-disables Quote App', async () => {
    renderComponent();
    await userEvent.click(screen.getByRole('button', { name: /rick and morty app/i }));
    await userEvent.click(screen.getByRole('button', { name: /quote app/i }));
    expect(screen.getByRole('button', { name: /quote app/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /rick and morty app/i })).not.toBeDisabled();
  });
});
