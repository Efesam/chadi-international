import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSequenceEmail } from "../emailSequence.js";

test("buildSequenceEmail welcome step greets the subscriber by name", () => {
  const { subject, text } = buildSequenceEmail("welcome", { id: "seq_1", name: "Amina" }, {});
  assert.match(subject, /Welcome to the CHADI family/);
  assert.match(text, /Dear Amina,/);
});

test("buildSequenceEmail falls back to 'there' when the subscriber has no name", () => {
  const { text } = buildSequenceEmail("welcome", { id: "seq_1", name: null }, {});
  assert.match(text, /Dear there,/);
});

test("buildSequenceEmail uses an admin-written override over the default template", () => {
  const settings = {
    emailSequence: {
      welcome: { subject: "Hey there!", body: "Dear {name}, glad you're here." },
    },
  };
  const { subject, text } = buildSequenceEmail("welcome", { id: "seq_1", name: "Tunde" }, settings);
  assert.equal(subject, "Hey there!");
  assert.match(text, /Dear Tunde, glad you're here\./);
  assert.doesNotMatch(text, /Welcome to CHADI International/);
});

test("buildSequenceEmail impact step fills in stats and fund-allocation placeholders", () => {
  const settings = {
    stats: [
      { label: "Projects", value: 16 },
      { label: "Beneficiaries", value: 12000 },
      { label: "Volunteers", value: 250 },
      { label: "Communities", value: 30 },
    ],
    fundAllocation: [{ category: "Programs & Field Work", percentage: 80 }],
  };
  const { text } = buildSequenceEmail("impact", { id: "seq_1", name: "Grace" }, settings);
  assert.match(text, /runs 16 projects/);
  assert.match(text, /12000 people/);
  assert.match(text, /30 communities/);
  assert.match(text, /250 volunteers/);
  assert.match(text, /80% of every donation/);
});

test("buildSequenceEmail impact step degrades gracefully with no stats configured", () => {
  const { text } = buildSequenceEmail("impact", { id: "seq_1", name: "Grace" }, {});
  assert.doesNotMatch(text, /\{projects\}|\{beneficiaries\}|\{communities\}|\{volunteers\}|\{percentage\}/);
});

test("buildSequenceEmail donationAsk step fills in the donate link", () => {
  const { text } = buildSequenceEmail("donationAsk", { id: "seq_1", name: "Chidi" }, {});
  assert.match(text, /https:\/\/www\.chadi-international\.org\/donate/);
});

test("buildSequenceEmail updates step fills in the blog link", () => {
  const { text } = buildSequenceEmail("updates", { id: "seq_1", name: "Chidi" }, {});
  assert.match(text, /https:\/\/www\.chadi-international\.org\/blog/);
});

test("every step signs off as Caleb Omale and includes an unsubscribe link keyed to the subscriber", () => {
  for (const step of ["welcome", "story", "impact", "donationAsk", "updates"]) {
    const { text, html } = buildSequenceEmail(step, { id: "seq_abc123", name: "Grace" }, {});
    assert.match(text, /Caleb Omale/, `${step} should sign off as Caleb Omale`);
    assert.match(text, /unsubscribe\/seq_abc123/i, `${step} should link to this subscriber's unsubscribe URL`);
    assert.match(html, /unsubscribe\/seq_abc123/i, `${step} html should also link to the unsubscribe URL`);
  }
});
