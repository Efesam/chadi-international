// Confirmation emails for the three public forms that previously sent
// nothing back to the person who submitted them - a contact message, a
// volunteer application, and an event sign-up all used to be saved silently
// for admin review with no acknowledgement at all. Same "Dear X, ... signed
// by Caleb" letter format as the donation receipt's gratitude letter (see
// lib/receiptImpact.js), so every automated email from CHADI reads the same.

import { SIGNATURE } from "./receiptImpact.js";

function renderEmail(heading, paragraphs) {
  const text = `${heading}\n\n${paragraphs.join("\n\n")}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color: #347928;">${heading}</h2>
      ${paragraphs.map((line) => `<p style="line-height:1.6;color:#333;">${line}</p>`).join("")}
      <hr style="margin-top:32px;border:none;border-top:1px solid #eee;" />
      <p style="font-size:12px;color:#888;">CHADI International &middot; This is an automated confirmation.</p>
    </div>
  `;
  return { html, text };
}

export function buildContactConfirmationEmail(entry) {
  const name = entry.name || "there";
  const { html, text } = renderEmail("Thank you for reaching out", [
    `Dear ${name},`,
    `Thank you for reaching out to CHADI International. We've received your message about "${entry.subject}" and it means a lot that you took the time to write to us.`,
    "Someone from our team will read it and get back to you soon, usually within a few working days.",
    "Thank you for your interest in our work.",
    ...SIGNATURE,
  ]);
  return { subject: "We've received your message - CHADI International", html, text };
}

/**
 * `project` is the full CMS project record for `entry.projectId`, when the
 * application was made from a specific project's page (fetched by the
 * caller via getProjectForEntry in routes/payments.js) - falls back to just
 * the title snapshot on the entry if the project has since been removed.
 */
export function buildVolunteerConfirmationEmail(entry, { project } = {}) {
  const name = entry.name || "there";
  const title = project?.title || entry.projectTitle;
  const causeLine = title
    ? `We're grateful for your willingness to support ${title}${project?.summary ? ` - ${project.summary}` : "."}`
    : "We're grateful for your willingness to give your time and skills to our work.";

  const { html, text } = renderEmail("Thank you for stepping up", [
    `Dear ${name},`,
    `Because of people like you, we're able to reach further into the communities that need us most. ${causeLine}`,
    "Our team will review your application and reach out soon with next steps.",
    "Thank you for choosing to be part of this work.",
    ...SIGNATURE,
  ]);
  return { subject: "Thank you for offering to volunteer with CHADI International", html, text };
}

/**
 * `event` is the full CMS event record for `entry.eventId` (fetched by the
 * caller) - used to quote the current date/location, falling back to just
 * the title snapshot captured on the entry if the event has since changed.
 */
export function buildEventSignupConfirmationEmail(entry, { event } = {}) {
  const name = entry.name || "there";
  const title = event?.title || entry.eventTitle;
  const detailsLine = event ? [event.date, event.location].filter(Boolean).join(" · ") : null;

  const { html, text } = renderEmail("See you there", [
    `Dear ${name},`,
    title
      ? `You're confirmed for ${title}${detailsLine ? ` (${detailsLine})` : ""}.`
      : "Your spot is confirmed.",
    "We're so glad you'll be joining us - thank you for being part of it.",
    "We'll be in touch with more details as the date gets closer.",
    ...SIGNATURE,
  ]);
  return { subject: title ? `You're signed up for ${title}!` : "You're signed up!", html, text };
}
