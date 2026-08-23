import { test } from "node:test";
import assert from "node:assert/strict";

const { buildImpactMessage } = await import("../receiptImpact.js");

test("buildImpactMessage writes a personal letter quoting the project's summary for a project-specific donation", () => {
  const paragraphs = buildImpactMessage(
    { name: "Jane", projectId: "project_miycn", projectTitle: "Community MIYCN Campaign" },
    {
      project: {
        title: "Community MIYCN Campaign",
        location: "Gombe State",
        summary: "Improving maternal, infant and young child nutrition in underserved communities.",
        beneficiaries: "500+ Mothers & Children",
      },
    }
  );

  const text = paragraphs.join(" ");
  assert.match(text, /Dear Jane,/);
  assert.match(text, /Gombe State/);
  assert.match(text, /Community MIYCN Campaign/);
  assert.match(text, /Improving maternal, infant and young child nutrition/);
  assert.match(text, /500\+ Mothers & Children/);
  assert.match(text, /Thank you for showing up for them/i);
  assert.match(text, /Caleb Omale/);
  assert.match(text, /Founder and Executive Director/);
});

test("buildImpactMessage uses a project's own custom donationLetter when it has one, substituting all four placeholders", () => {
  const paragraphs = buildImpactMessage(
    { name: "Kemi", projectId: "project_sorcest", projectTitle: "Digital Skills for Orphans" },
    {
      project: {
        title: "Digital Skills for Orphans",
        location: "Bauchi State",
        summary: "Providing technology education for orphaned children.",
        beneficiaries: "150 Students",
        donationLetter:
          "Hi {name},\n\n{title} in {location} is changing lives for {beneficiaries}.\n\nThank you.",
      },
    }
  );

  const text = paragraphs.join(" ");
  assert.match(text, /Hi Kemi,/);
  assert.match(text, /Digital Skills for Orphans in Bauchi State/);
  assert.match(text, /150 Students/);
  assert.doesNotMatch(text, /Somewhere.*right now, someone is getting help/i);
  assert.match(text, /Caleb Omale/);
});

test("buildImpactMessage falls back to the generic project letter when a project has no custom donationLetter", () => {
  const paragraphs = buildImpactMessage(
    { name: "Kemi", projectId: "project_sorcest", projectTitle: "Digital Skills for Orphans" },
    {
      project: {
        title: "Digital Skills for Orphans",
        summary: "Providing technology education for orphaned children.",
        donationLetter: "",
      },
    }
  );

  const text = paragraphs.join(" ");
  assert.match(text, /Somewhere.*right now, someone is getting help because you chose to give to Digital Skills for Orphans/i);
});

test("buildImpactMessage falls back to just the project title when the project record is missing", () => {
  const paragraphs = buildImpactMessage(
    { name: "Jane", projectId: "project_deleted", projectTitle: "Old Project" },
    { project: null }
  );

  const text = paragraphs.join(" ");
  assert.match(text, /Old Project/);
  assert.match(text, /Caleb Omale/);
});

test("buildImpactMessage falls back to just the project title when no project context is passed at all", () => {
  const paragraphs = buildImpactMessage({ name: "Jane", projectId: "project_x", projectTitle: "Some Project" });
  assert.match(paragraphs.join(" "), /Some Project/);
});

test("buildImpactMessage writes the general letter (with the fund-allocation figure) for a general donation", () => {
  const paragraphs = buildImpactMessage(
    { name: "Jane", projectId: null },
    {
      settings: {
        fundAllocation: [
          { category: "Programs & Field Work", percentage: 80 },
          { category: "Administration", percentage: 12 },
          { category: "Fundraising & Outreach", percentage: 8 },
        ],
      },
    }
  );

  const text = paragraphs.join(" ");
  assert.match(text, /Dear Jane,/);
  assert.match(text, /80% of every donation goes straight to the children/);
  assert.match(text, /a young girl stood up in front of everyone/i);
  assert.match(text, /Caleb Omale/);
  assert.match(text, /Founder and Executive Director/);
});

test("buildImpactMessage uses an admin-written donationLetter template when one is set, substituting {name} and {percentage}", () => {
  const paragraphs = buildImpactMessage(
    { name: "Priya", projectId: null },
    {
      settings: {
        fundAllocation: [{ category: "Programs & Field Work", percentage: 75 }],
        donationLetter: "Hi {name},\n\nThanks for the {percentage}% that goes to programs.\n\nWith love,",
      },
    }
  );

  const text = paragraphs.join(" ");
  assert.match(text, /Hi Priya,/);
  assert.match(text, /Thanks for the 75% that goes to programs/);
  assert.doesNotMatch(text, /a young girl stood up/i);
  assert.match(text, /Caleb Omale/);
});

test("buildImpactMessage returns null for a general donation with no fund allocation configured", () => {
  const paragraphs = buildImpactMessage({ projectId: null }, { settings: {} });
  assert.equal(paragraphs, null);
});

test("buildImpactMessage returns null when no context is passed at all", () => {
  const paragraphs = buildImpactMessage({ projectId: null });
  assert.equal(paragraphs, null);
});
