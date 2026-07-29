import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "../Modal";

describe("Modal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <Modal open={false} onClose={vi.fn()} labelledBy="t">
        content
      </Modal>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders as an accessible dialog when open", () => {
    render(
      <Modal open onClose={vi.fn()} labelledBy="t">
        <p>Hello</p>
      </Modal>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} labelledBy="t">
        content
      </Modal>
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} labelledBy="t">
        content
      </Modal>
    );

    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders a title header when `title` is provided", () => {
    render(
      <Modal open onClose={vi.fn()} title="Edit Project" labelledBy="admin-modal-title">
        content
      </Modal>
    );
    expect(screen.getByRole("heading", { name: "Edit Project" })).toBeInTheDocument();
  });
});
