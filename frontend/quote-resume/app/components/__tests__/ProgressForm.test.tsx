import { render, screen } from "@testing-library/react";
import ProgressForm from "../forms/ProgressForm";
import { describe } from "node:test";
import { expect, it } from "vitest";

function renderComponent() {
  return render(
    <ProgressForm />
  );
}

describe('ProgressForm', () => {
  it('renders the form and inputs', () => {
    renderComponent();

    expect(screen.getByLabelText('Last name')).toBeInTheDocument();
    expect(screen.getByLabelText('First name')).toBeInTheDocument();
    expect(screen.getByLabelText('Reason')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });

  it('Updates the progress bar', () => {
    // Updates the progress bar
  });
});