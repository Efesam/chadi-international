/**
 * Builds the personal "thank you" letter that opens a donation receipt (PDF
 * and email) - grounded in the specific project donated to, when there is
 * one, or CHADI's general story otherwise. Returns an array of paragraphs
 * (the caller joins/renders them), or null when there's nothing to say - no
 * matching project and no fund allocation configured in Settings.
 *
 * Lives in its own file (rather than inside payments.js or receiptPdf.js) so
 * both can import it without a circular dependency between them.
 */

// Shared with lib/confirmationEmails.js so every automated email (receipt,
// contact/volunteer/event confirmations) closes the same way.
export const SIGNATURE = ["Caleb Omale", "Founder and Executive Director, CHADI International"];

/**
 * The general (non-project) donation letter, editable by an admin from
 * Settings -> Donation Letter (settings.donationLetter) - this is what's
 * used until they write their own. `{name}` and `{percentage}` are replaced
 * with the donor's name and the "Programs & Field Work" share of
 * settings.fundAllocation respectively, in either the default or a custom
 * letter. Paragraphs are separated by a blank line.
 */
export const DEFAULT_DONATION_LETTER = `Dear {name},

Somewhere right now, a child who has never been told they matter is getting a second chance. And you are part of why.

Your donation is going straight to children who have lost parents, children living with special needs, young people who woke up this morning with no one in their corner. We sit with them, we teach them, we remind them they are not forgotten.

Last time we gathered, a young girl stood up in front of everyone and performed for the first time in her life. She had never done anything like that before. When the room cheered for her, she covered her face and cried. Not from sadness. From shock - because nobody had ever clapped for her before.

Your gift made that moment possible.

{percentage}% of every donation goes straight to the children. The rest keeps us running so we can reach more of them.

This is bigger than any one gift. We are building something that will outlast all of us - a world where no child grows up invisible. And you are now part of that.

Thank you for showing up for them.`;

/** Splits a template into paragraphs on blank lines, trimming each. */
function splitParagraphs(text) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function buildImpactMessage(entry, { project, settings } = {}) {
  const name = entry.name || "there";

  if (entry.projectId) {
    const title = project?.title || entry.projectTitle;

    if (project?.summary) {
      const whereLine = project.location ? ` in ${project.location}` : "";
      const beneficiariesLine = project.beneficiaries
        ? `Because of donors like you, this work has already reached ${project.beneficiaries} - and today, you've helped us go even further.`
        : "Because of donors like you, we're able to keep this work going - and today, you've helped us go even further.";

      // An admin can write this specific project its own letter (Manage
      // Projects -> Donation Letter) so different projects don't all read
      // identically - {name}, {title}, {location} and {beneficiaries} are
      // filled in either way. Falls back to the generic-but-real-data
      // paragraphs below when the project hasn't been given one.
      const paragraphs = project.donationLetter?.trim()
        ? splitParagraphs(project.donationLetter)
            .map((paragraph) =>
              paragraph
                .replaceAll("{name}", name)
                .replaceAll("{title}", title)
                .replaceAll("{location}", project.location || "the community")
                .replaceAll("{beneficiaries}", project.beneficiaries || "the people we serve")
            )
        : [
            `Dear ${name},`,
            `Somewhere${whereLine} right now, someone is getting help because you chose to give to ${title}. ${project.summary}`,
            beneficiariesLine,
            "This is bigger than any one gift. It's part of something that will outlast all of us - a CHADI International where no one we serve is left behind. And you are now part of that.",
            "Thank you for showing up for them.",
          ];

      return [...paragraphs, ...SIGNATURE];
    }

    // The project may since have been deleted or renamed - fall back to
    // whatever title was captured on the donation itself rather than the
    // general letter below, since this donor did pick a specific cause.
    if (title) {
      return [
        `Dear ${name},`,
        `Thank you for choosing to support ${title}. Your generosity is already making a difference in the lives of the people this work reaches.`,
        "Thank you for showing up for them.",
        ...SIGNATURE,
      ];
    }
  }

  const allocation = settings?.fundAllocation;
  if (!allocation?.length) return null;

  const programShare = allocation.find((item) => /program/i.test(item.category)) || allocation[0];
  const template = settings?.donationLetter?.trim() || DEFAULT_DONATION_LETTER;
  const letterText = template
    .replaceAll("{name}", name)
    .replaceAll("{percentage}", String(programShare.percentage));

  return [...splitParagraphs(letterText), ...SIGNATURE];
}
