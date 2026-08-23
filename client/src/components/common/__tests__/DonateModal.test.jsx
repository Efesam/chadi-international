import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DonateModal from "../DonateModal";
import * as api from "../../../services/api";

vi.mock("../../../services/api", async () => {
  const actual = await vi.importActual("../../../services/api");
  return {
    ...actual,
    verifyPayment: vi.fn(),
    reportPaymentIssue: vi.fn(() => Promise.resolve()),
    downloadReceiptByReference: vi.fn(() => Promise.resolve()),
    getOrCreateMonthlyPlan: vi.fn(),
  };
});

const FAKE_REFERENCE = "T_TEST_REF_123";

/** Stands in for the real Paystack popup - immediately reports a "successful charge" for the given reference, same shape the real script would return in its callback. */
function mockPaystackPopup() {
  window.PaystackPop = {
    setup: vi.fn((options) => {
      setTimeout(() => options.callback({ reference: FAKE_REFERENCE }), 0);
      return { openIframe: vi.fn() };
    }),
  };
}

/**
 * The form opens on Hope Alive Circle (monthly) - the one-off flows below
 * switch to it explicitly rather than relying on it being the default.
 */
function selectOneTime() {
  fireEvent.click(screen.getByRole("button", { name: /^one-time$/i }));
}

describe("DonateModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("opens on Hope Alive Circle, with one-time giving as the secondary option", () => {
    mockPaystackPopup();
    render(<DonateModal open onClose={vi.fn()} />);

    expect(screen.getByRole("button", { name: /join hope alive circle/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^give ₦/i })).not.toBeInTheDocument();

    selectOneTime();
    expect(screen.getByRole("button", { name: /^give ₦5,000$/i })).toBeInTheDocument();
  });

  it("replaces the form with an animated success screen and a working receipt download once the server confirms payment", async () => {
    mockPaystackPopup();
    api.verifyPayment.mockResolvedValue({ amount: 5000, reference: FAKE_REFERENCE, type: "payment" });

    const onClose = vi.fn();
    render(<DonateModal open onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText("Full name"), { target: { value: "Test Donor" } });
    fireEvent.change(screen.getByPlaceholderText("Email address"), { target: { value: "donor@example.com" } });
    selectOneTime();
    fireEvent.click(screen.getByRole("button", { name: /give ₦5,000/i }));

    await waitFor(() => expect(screen.getByText("Payment Received!")).toBeInTheDocument());
    expect(screen.getByText(new RegExp(`Reference: ${FAKE_REFERENCE}`))).toBeInTheDocument();
    // The form itself is gone, not just hidden behind the success message.
    expect(screen.queryByPlaceholderText("Full name")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /download receipt/i }));
    await waitFor(() =>
      expect(api.downloadReceiptByReference).toHaveBeenCalledWith(FAKE_REFERENCE, expect.stringContaining(FAKE_REFERENCE))
    );

    fireEvent.click(screen.getByRole("button", { name: /^done$/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("reports a payment issue and shows the reference when Paystack confirms the charge but the server can't verify it", async () => {
    mockPaystackPopup();
    api.verifyPayment.mockRejectedValue(new Error("verify failed"));

    render(<DonateModal open onClose={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText("Full name"), { target: { value: "Test Donor" } });
    fireEvent.change(screen.getByPlaceholderText("Email address"), { target: { value: "donor@example.com" } });
    selectOneTime();
    fireEvent.click(screen.getByRole("button", { name: /give ₦5,000/i }));

    await waitFor(() => expect(screen.getByText(/could not confirm it automatically/i)).toBeInTheDocument());
    expect(screen.getByText(new RegExp(FAKE_REFERENCE))).toBeInTheDocument();

    await waitFor(() =>
      expect(api.reportPaymentIssue).toHaveBeenCalledWith(
        expect.objectContaining({
          reference: FAKE_REFERENCE,
          name: "Test Donor",
          email: "donor@example.com",
          amount: 5000,
          frequency: "once",
        })
      )
    );
  });

  it("shows a fresh form (not the stale success screen) if the modal is reopened after a successful donation", async () => {
    mockPaystackPopup();
    api.verifyPayment.mockResolvedValue({ amount: 5000, reference: FAKE_REFERENCE, type: "payment" });

    const onClose = vi.fn();
    const { rerender } = render(<DonateModal open onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText("Full name"), { target: { value: "Test Donor" } });
    fireEvent.change(screen.getByPlaceholderText("Email address"), { target: { value: "donor@example.com" } });
    selectOneTime();
    fireEvent.click(screen.getByRole("button", { name: /give ₦5,000/i }));
    await waitFor(() => expect(screen.getByText("Payment Received!")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /^done$/i }));
    rerender(<DonateModal open={false} onClose={onClose} />);
    rerender(<DonateModal open onClose={onClose} />);

    expect(screen.queryByText("Payment Received!")).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText("Full name")).toHaveValue("");
  });
});
