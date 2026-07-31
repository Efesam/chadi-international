/**
 * Builds a one-paragraph "here's what your gift does" message for a donation
 * receipt (PDF and email) - specific to the project donated to, when there is
 * one, or a general breakdown of how unrestricted gifts are spent otherwise.
 * Lives in its own file (rather than inside payments.js or receiptPdf.js) so
 * both can import it without a circular dependency between them.
 *
 * Returns null when there's nothing truthful to say - no matching project
 * and no fund allocation configured in Settings - rather than inventing one.
 */
export function buildImpactMessage(entry, { project, settings } = {}) {
  if (entry.projectId) {
    const title = project?.title || entry.projectTitle;

    if (project?.summary) {
      const beneficiariesLine = project.beneficiaries
        ? ` Because of donors like you, this work has already reached ${project.beneficiaries} - and your gift today helps us go even further.`
        : " Your gift today helps us go even further.";
      return (
        `Because of your generosity, ${title} is able to keep changing lives - ${project.summary}` +
        `${beneficiariesLine} Thank you for making this possible.`
      );
    }

    // The project may since have been deleted or renamed - fall back to
    // whatever title was captured on the donation itself rather than the
    // general message below, since this donor did pick a specific cause.
    if (title) {
      return `Because of your generosity, ${title} is able to keep changing lives. Thank you for making this possible.`;
    }
  }

  const allocation = settings?.fundAllocation;
  if (!allocation?.length) return null;

  const parts = allocation.map((item) => `${item.percentage}% to ${item.category}`);
  const list = parts.length > 1 ? `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}` : parts[0];

  return (
    "Because of your generosity, we're able to keep showing up for the communities that need us most - " +
    "mothers and young children, orphaned and vulnerable youth, families rebuilding their futures, and so " +
    `many others across CHADI's work. Your gift is put to work right where it's needed most: ${list}. ` +
    "Thank you for making this possible."
  );
}
