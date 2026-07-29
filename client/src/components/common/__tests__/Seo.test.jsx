import { describe, it, expect } from "vitest";
import { render, waitFor } from "@testing-library/react";
import Seo from "../Seo";

describe("Seo", () => {
  it("sets document.title and a description meta tag", async () => {
    render(<Seo title="Our Projects" description="See what CHADI is working on." />);

    await waitFor(() => expect(document.title).toBe("Our Projects | CHADI International"));

    const description = document.querySelector('meta[name="description"]');
    expect(description).not.toBeNull();
    expect(description.getAttribute("content")).toBe("See what CHADI is working on.");
  });

  it("adds a noindex robots tag when requested", async () => {
    render(<Seo title="Not Found" noindex />);

    await waitFor(() => {
      const robots = document.querySelector('meta[name="robots"]');
      expect(robots).not.toBeNull();
      expect(robots.getAttribute("content")).toBe("noindex, nofollow");
    });
  });
});
