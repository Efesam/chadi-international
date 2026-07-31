import { test } from "node:test";
import assert from "node:assert/strict";

const { buildImpactMessage } = await import("../receiptImpact.js");

test("buildImpactMessage quotes the project's summary for a project-specific donation", () => {
  const message = buildImpactMessage(
    { projectId: "project_miycn", projectTitle: "Community MIYCN Campaign" },
    {
      project: {
        title: "Community MIYCN Campaign",
        summary: "Improving maternal, infant and young child nutrition in underserved communities.",
        beneficiaries: "500+ Mothers & Children",
      },
    }
  );

  assert.match(message, /Because of your generosity/i);
  assert.match(message, /Community MIYCN Campaign/);
  assert.match(message, /Improving maternal, infant and young child nutrition/);
  assert.match(message, /500\+ Mothers & Children/);
  assert.match(message, /Thank you for making this possible/i);
});

test("buildImpactMessage falls back to just the project title when the project record is missing", () => {
  const message = buildImpactMessage(
    { projectId: "project_deleted", projectTitle: "Old Project" },
    { project: null }
  );

  assert.match(message, /Old Project/);
});

test("buildImpactMessage falls back to just the project title when no project context is passed at all", () => {
  const message = buildImpactMessage({ projectId: "project_x", projectTitle: "Some Project" });
  assert.match(message, /Some Project/);
});

test("buildImpactMessage describes the fund allocation breakdown for a general donation", () => {
  const message = buildImpactMessage(
    { projectId: null },
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

  assert.match(message, /Because of your generosity/i);
  assert.match(message, /80% to Programs & Field Work/);
  assert.match(message, /12% to Administration/);
  assert.match(message, /and 8% to Fundraising & Outreach/);
});

test("buildImpactMessage returns null for a general donation with no fund allocation configured", () => {
  const message = buildImpactMessage({ projectId: null }, { settings: {} });
  assert.equal(message, null);
});

test("buildImpactMessage returns null when no context is passed at all", () => {
  const message = buildImpactMessage({ projectId: null });
  assert.equal(message, null);
});
