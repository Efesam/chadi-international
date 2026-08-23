// The automated 5-part "welcome series" sent to every new newsletter
// subscriber and every new donor (whichever happens first - a person who
// does both is only ever enrolled once, see enrollInSequence below):
// Welcome (day 0) -> Story (day 3) -> Impact (day 7) -> Donation Ask (day 14)
// -> Updates (day 21). A subscriber's progress is tracked in the
// "sequenceSubscribers" collection; runSequenceSweep (called from server.js
// on a timer, same pattern as autoReconcilePayments in routes/payments.js)
// sends whichever step is next due for each subscriber.

import { readCollection, updateCollection, generateId } from "./store.js";
import { sendMail } from "./mailer.js";
import { SIGNATURE } from "./receiptImpact.js";
import { seedSettings } from "./seeds.js";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const SEQUENCE_STEPS = [
  { key: "welcome", label: "Welcome", dayOffset: 0 },
  { key: "story", label: "Story", dayOffset: 3 },
  { key: "impact", label: "Impact", dayOffset: 7 },
  { key: "donationAsk", label: "Donation Ask", dayOffset: 14 },
  { key: "updates", label: "Updates", dayOffset: 21 },
];

/**
 * The wording used until an admin writes their own for a given step, from
 * Settings -> Welcome Email Series (settings.emailSequence). Mirrors
 * receiptImpact.js's DEFAULT_DONATION_LETTER pattern - kept here (rather
 * than only in the client placeholder copy) since this is what actually
 * gets sent.
 */
export const DEFAULT_TEMPLATES = {
  welcome: {
    subject: "Welcome to the CHADI family",
    body: `Dear {name},

Welcome to CHADI International - thank you for joining us.

Whether you found us through a friend, a donation, or simply because you believe children and communities deserve a fighting chance, we're glad you're here.

Over the next few weeks, we'll share a few stories from the field, show you exactly where support like yours goes, and let you know how you can be part of what's next. No spam, no noise - just the real work, as it happens.

Thank you for standing with us.`,
  },
  story: {
    subject: "A story we think you'll want to hear",
    body: `Dear {name},

We want to tell you about someone whose story stayed with us.

At one of our sickle cell support sessions, a teenage boy sat quietly at the back for weeks, never speaking. Living with sickle cell disease had taught him to expect pain first and people second. Then one afternoon, surrounded by others who understood exactly what he carried, he finally spoke - about the fear, the hospital nights, the friends who stopped calling.

By the end of that session, he wasn't the quiet one anymore. He was the one reassuring a newer member that it gets easier.

This is the work: not just treatment, but belonging - community that says, out loud, "you are not alone in this."

Stories like his are why we do what we do, and why we're glad you're part of this community.`,
  },
  impact: {
    subject: "Here's what your community is doing together",
    body: `Dear {name},

Numbers rarely capture what matters most, but they do tell part of the story.

Right now, CHADI International runs {projects} projects, reaching an estimated {beneficiaries} people across {communities} communities - alongside {volunteers} volunteers who show up again and again.

{percentage}% of every donation goes directly into programs and field work: school supplies, health support, mental health and sickle cell care, and livelihood training for women and families working to stand on their own feet.

You're part of every one of those numbers now. Thank you for that.`,
  },
  donationAsk: {
    subject: "Will you help write the next story?",
    body: `Dear {name},

By now you've heard a little about who we are and the people we walk alongside. We'd love for you to help us do more of it.

A monthly gift, even a modest one, is what lets us plan ahead - keeping a health worker in the field, a classroom stocked, and a support group meeting every week rather than whenever funds allow.

If you've been thinking about it, this is your invitation: {donateUrl}

Whatever you're able to give, thank you for considering it.`,
  },
  updates: {
    subject: "Stay close to the work",
    body: `Dear {name},

This is the last email in this short welcome series - but certainly not the last you'll hear from us.

We regularly publish new stories, project updates, and field reports on our blog: {blogUrl}. It's where we share the moments that don't fit neatly into an email, and the ongoing progress of the work your support makes possible.

From here, expect the occasional update rather than a set schedule - always real, always from the field.

Thank you for walking with us this far. We're glad you're here.`,
  },
};

/** Splits a template into paragraphs on blank lines, trimming each. */
function splitParagraphs(text) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

/** Case-insensitive lookup of a settings.stats entry by a fragment of its label (e.g. "beneficiaries", "communit" for Communities). */
function statValue(settings, labelFragment) {
  return settings?.stats?.find((stat) => new RegExp(labelFragment, "i").test(stat.label))?.value;
}

/**
 * Builds one step's email for one subscriber: applies any admin override
 * from settings.emailSequence[stepKey], falling back to DEFAULT_TEMPLATES,
 * fills in {name}/{donateUrl}/{blogUrl}/impact-stat placeholders, and adds
 * the same signature and an unsubscribe link every email in the series
 * carries.
 */
export function buildSequenceEmail(stepKey, subscriber, settings = {}) {
  const template = DEFAULT_TEMPLATES[stepKey];
  const override = settings?.emailSequence?.[stepKey];

  const subject = override?.subject?.trim() || template.subject;
  const bodyTemplate = override?.body?.trim() || template.body;

  const siteUrl = process.env.SITE_URL || "https://www.chadi-international.org";
  const apiUrl = process.env.API_URL || `http://127.0.0.1:${process.env.PORT || 4000}`;
  const unsubscribeUrl = `${apiUrl}/api/email-sequence/unsubscribe/${subscriber.id}`;

  const allocation = settings?.fundAllocation || [];
  const programShare = allocation.find((item) => /program/i.test(item.category)) || allocation[0];

  const filledBody = bodyTemplate
    .replaceAll("{name}", subscriber.name || "there")
    .replaceAll("{donateUrl}", `${siteUrl}/donate`)
    .replaceAll("{blogUrl}", `${siteUrl}/blog`)
    .replaceAll("{projects}", String(statValue(settings, "project") ?? "many"))
    .replaceAll("{beneficiaries}", String(statValue(settings, "beneficiar") ?? "thousands of"))
    .replaceAll("{communities}", String(statValue(settings, "communit") ?? "dozens of"))
    .replaceAll("{volunteers}", String(statValue(settings, "volunteer") ?? "hundreds of"))
    .replaceAll("{percentage}", String(programShare?.percentage ?? 80));

  const paragraphs = [...splitParagraphs(filledBody), ...SIGNATURE];
  const text = `${subject}\n\n${paragraphs.join("\n\n")}\n\nUnsubscribe: ${unsubscribeUrl}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color: #347928;">${subject}</h2>
      ${paragraphs.map((line) => `<p style="line-height:1.6;color:#333;">${line}</p>`).join("")}
      <hr style="margin-top:32px;border:none;border-top:1px solid #eee;" />
      <p style="font-size:12px;color:#888;">
        CHADI International &middot; You're receiving this as part of our welcome series.
        <a href="${unsubscribeUrl}" style="color:#888;">Unsubscribe</a>
      </p>
    </div>
  `;

  return { subject, html, text };
}

/**
 * Enrolls an email into the welcome series, unless it already has a record
 * (enrolled and mid-series, finished, or previously unsubscribed) - a
 * newsletter signup and a first donation from the same person must not
 * create two overlapping sequences, and someone who already opted out must
 * never be silently re-enrolled by a later trigger. Matching is
 * case-insensitive since email casing isn't meaningful.
 */
export async function enrollInSequence({ email, name, source }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) return null;

  return updateCollection("sequenceSubscribers", () => [], (subscribers) => {
    const existing = subscribers.find((s) => s.email === normalizedEmail);
    if (existing) return { result: existing };

    const entry = {
      id: generateId("seq"),
      email: normalizedEmail,
      name: name || null,
      source,
      startedAt: new Date().toISOString(),
      currentStep: 0,
      lastSentAt: null,
      unsubscribed: false,
    };

    return { data: [entry, ...subscribers], result: entry };
  });
}

/**
 * Sends whichever step is next due for each active subscriber. Called once
 * at server startup and then on a timer from server.js, same pattern as
 * autoReconcilePayments - covers the server being restarted or down when a
 * step would otherwise have fired. Each subscriber's own failure is caught
 * so one bad send doesn't stop the rest of the sweep.
 */
export async function runSequenceSweep() {
  const subscribers = await readCollection("sequenceSubscribers", () => []);
  const now = Date.now();

  const due = subscribers.filter((s) => {
    if (s.unsubscribed || s.currentStep >= SEQUENCE_STEPS.length) return false;
    const elapsedDays = (now - new Date(s.startedAt).getTime()) / MS_PER_DAY;
    return elapsedDays >= SEQUENCE_STEPS[s.currentStep].dayOffset;
  });

  if (due.length === 0) return;

  const settings = await readCollection("settings", seedSettings);

  for (const subscriber of due) {
    const step = SEQUENCE_STEPS[subscriber.currentStep];

    try {
      const { subject, html, text } = buildSequenceEmail(step.key, subscriber, settings);
      await sendMail({ to: subscriber.email, subject, html, text });

      await updateCollection("sequenceSubscribers", () => [], (list) => {
        const index = list.findIndex((s) => s.id === subscriber.id);
        if (index === -1) return { result: null };

        const next = [...list];
        next[index] = {
          ...next[index],
          currentStep: next[index].currentStep + 1,
          lastSentAt: new Date().toISOString(),
        };
        return { data: next, result: next[index] };
      });

      console.log(`[emailSequence] sent "${step.key}" to ${subscriber.email}`);
    } catch (error) {
      console.error(`[emailSequence] failed to send "${step.key}" to ${subscriber.email}:`, error.message);
    }
  }
}
