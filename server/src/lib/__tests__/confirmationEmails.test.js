import { test } from "node:test";
import assert from "node:assert/strict";

const { buildContactConfirmationEmail, buildVolunteerConfirmationEmail, buildEventSignupConfirmationEmail } =
  await import("../confirmationEmails.js");

test("buildContactConfirmationEmail thanks the sender and quotes their subject", () => {
  const { subject, text, html } = buildContactConfirmationEmail({
    name: "Amina",
    email: "amina@example.com",
    subject: "Partnership inquiry",
    message: "Hi there",
  });

  assert.match(subject, /received your message/i);
  assert.match(text, /Dear Amina,/);
  assert.match(text, /Partnership inquiry/);
  assert.match(html, /Partnership inquiry/);
  assert.match(text, /Caleb Omale/);
  assert.match(text, /Founder and Executive Director/);
});

test("buildVolunteerConfirmationEmail mentions the specific project when one is passed", () => {
  const { text } = buildVolunteerConfirmationEmail(
    { name: "Tunde", email: "tunde@example.com", projectId: "project_miycn", projectTitle: "Community MIYCN Campaign" },
    { project: { title: "Community MIYCN Campaign", summary: "Improving maternal and child nutrition." } }
  );

  assert.match(text, /Dear Tunde,/);
  assert.match(text, /Community MIYCN Campaign/);
  assert.match(text, /Improving maternal and child nutrition/);
  assert.match(text, /Caleb Omale/);
});

test("buildVolunteerConfirmationEmail falls back to a general message with no project", () => {
  const { text } = buildVolunteerConfirmationEmail({ name: "Tunde", email: "tunde@example.com" });
  assert.match(text, /give your time and skills/i);
});

test("buildEventSignupConfirmationEmail quotes the event's current date and location", () => {
  const { subject, text } = buildEventSignupConfirmationEmail(
    { name: "Grace", email: "grace@example.com", eventId: "event_1", eventTitle: "Volunteer Orientation Day" },
    { event: { title: "Volunteer Orientation Day", date: "October 18, 2026", location: "Online and Field Hubs" } }
  );

  assert.match(subject, /Volunteer Orientation Day/);
  assert.match(text, /Dear Grace,/);
  assert.match(text, /October 18, 2026/);
  assert.match(text, /Online and Field Hubs/);
  assert.match(text, /Caleb Omale/);
});

test("buildEventSignupConfirmationEmail falls back to the entry's own title when the event record is missing", () => {
  const { subject, text } = buildEventSignupConfirmationEmail({
    name: "Grace",
    email: "grace@example.com",
    eventId: "event_deleted",
    eventTitle: "Old Event",
  });

  assert.match(subject, /Old Event/);
  assert.match(text, /Old Event/);
});
