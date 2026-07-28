import PDFDocument from "pdfkit";

const GREEN = "#347928";
const GOLD = "#FCCD2A";

/**
 * Renders a one-page donation receipt PDF and resolves it as a Buffer, for
 * attaching to the receipt email (see routes/payments.js). `settings.orgRegistration`
 * is only printed when set - most orgs will want this on a real receipt,
 * but it's real organizational information CHADI has to provide, not
 * something this code should invent.
 */
export function buildReceiptPdf(entry, settings = {}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const isSubscription = entry.type === "subscription";
    const amount = `NGN ${Number(entry.amount || 0).toLocaleString()}`;
    const date = entry.paidAt ? new Date(entry.paidAt) : new Date(entry.createdAt);

    doc.rect(0, 0, doc.page.width, 90).fill(GREEN);
    doc
      .fillColor("#ffffff")
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("CHADI International", 50, 32);
    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor(GOLD)
      .text("Donation Receipt", 50, 58);

    doc.moveDown(4);
    doc.fillColor("#1f2937").font("Helvetica-Bold").fontSize(14);
    doc.text(isSubscription ? "Thank you for joining Hope Alive Circle" : "Thank you for your donation");
    doc.moveDown(1);

    const row = (label, value) => {
      if (!value) return;
      doc.font("Helvetica-Bold").fontSize(10).fillColor("#6b7280").text(label);
      doc.font("Helvetica").fontSize(12).fillColor("#1f2937").text(String(value));
      doc.moveDown(0.8);
    };

    row("Donor", entry.name || entry.email);
    row("Email", entry.email);
    row("Amount", amount + (isSubscription ? " / month" : ""));
    row("Date", date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
    row("Reference", entry.reference);
    row("Project", entry.projectTitle);

    doc.moveDown(1);
    doc
      .moveTo(50, doc.y)
      .lineTo(doc.page.width - 50, doc.y)
      .strokeColor("#e5e7eb")
      .stroke();
    doc.moveDown(1);

    if (settings.orgRegistration) {
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#9ca3af")
        .text(`CHADI International - ${settings.orgRegistration}`);
      doc.moveDown(0.5);
    }

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#9ca3af")
      .text("This receipt was generated automatically at the time of payment.");

    doc.end();
  });
}
