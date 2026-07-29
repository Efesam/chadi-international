import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CookieConsent from "../CookieConsent";

const STORAGE_KEY = "chadi_cookie_consent";

function renderBanner() {
  return render(
    <MemoryRouter>
      <CookieConsent />
    </MemoryRouter>
  );
}

describe("CookieConsent", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows the banner on a first visit", () => {
    renderBanner();
    expect(screen.getByText(/Accept/)).toBeInTheDocument();
    expect(screen.getByText(/Decline/)).toBeInTheDocument();
  });

  it("hides the banner and remembers acceptance", () => {
    renderBanner();
    fireEvent.click(screen.getByText("Accept"));

    expect(screen.queryByText("Accept")).not.toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toBe("accepted");
  });

  it("hides the banner and remembers decline", () => {
    renderBanner();
    fireEvent.click(screen.getByText("Decline"));

    expect(screen.queryByText("Decline")).not.toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toBe("declined");
  });

  it("stays hidden on a later visit after a previous choice", () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    renderBanner();
    expect(screen.queryByText("Accept")).not.toBeInTheDocument();
  });

  it("does not throw when analytics isn't configured (VITE_PLAUSIBLE_DOMAIN unset)", () => {
    renderBanner();
    expect(() => fireEvent.click(screen.getByText("Accept"))).not.toThrow();
  });
});
