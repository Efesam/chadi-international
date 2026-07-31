import PDFDocument from "pdfkit";
import { fileURLToPath } from "node:url";
import { buildImpactMessage } from "./receiptImpact.js";

const GREEN = "#347928";
const GOLD = "#FCCD2A";

// Copied into the server's own tree (rather than reaching into client/src)
// so the receipt PDF still renders correctly when the server is built and
// deployed as its own standalone image - see server/Dockerfile, which only
// ever copies server/src.
const LOGO_PATH = fileURLToPath(new URL("../assets/logo.png", import.meta.url));

const CHANNEL_LABELS = {
  card: "Card",
  bank: "Bank",
  bank_transfer: "Bank Transfer",
  ussd: "USSD",
  qr: "QR Code",
  mobile_money: "Mobile Money",
  paypal: "PayPal",
};

/**
 * Renders a one-page donation receipt PDF and resolves it as a Buffer, for
 * attaching to the receipt email (see routes/payments.js). The organizational
 * fields below (`orgRegistration`/`orgAddress`/`orgPhone`/`receiptSignatory`)
 * are each only printed when set - most orgs will want all of them on a real
 * receipt, but they're real organizational facts only CHADI can provide
 * accurately, not something this code should invent.
 *
 * `project` is the full CMS project record for `entry.projectId` (fetched by
 * the caller, since this module doesn't read collections itself) - used to
 * print a project-specific "here's what your gift does" message when
 * present, or a general fund-allocation breakdown otherwise. See
 * lib/receiptImpact.js.
 */
export function buildReceiptPdf(entry, settings = {}, { project } = {}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const isSubscription = entry.type === "subscription";
    const amount = `NGN ${Number(entry.amount || 0).toLocaleString()}`;
    const date = entry.paidAt ? new Date(entry.paidAt) : new Date(entry.createdAt);
    const paymentMethod = CHANNEL_LABELS[entry.channel] || entry.channel;

    doc.rect(0, 0, doc.page.width, 90).fill(GREEN);
    doc.image(LOGO_PATH, 50, 20, { width: 50, height: 50 });
    doc
      .fillColor("#ffffff")
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("CHADI International", 112, 32);
    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor(GOLD)
      .text("Donation Receipt", 112, 58);

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

    row("Receipt No.", entry.receiptNumber);
    row("Donor", entry.name || entry.email);
    row("Email", entry.email);
    row("Amount", amount + (isSubscription ? " / month" : ""));
    row("Payment Method", paymentMethod);
    row("Date", date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
    row("Reference", entry.reference);
    row("Project", entry.projectTitle);

    const impactMessage = buildImpactMessage(entry, { project, settings });
    if (impactMessage) {
      doc.font("Helvetica-Bold").fontSize(10).fillColor(GREEN).text("With Gratitude");
      doc.moveDown(0.3);
      doc.font("Helvetica").fontSize(10).fillColor("#374151").text(impactMessage);
      doc.moveDown(0.8);
    }

    if (isSubscription) {
      doc
        .font("Helvetica-Oblique")
        .fontSize(9)
        .fillColor("#6b7280")
        .text("This receipt confirms one monthly installment of an ongoing Hope Alive Circle pledge.");
      doc.moveDown(0.8);
    }

    doc.moveDown(0.5);
    doc
      .moveTo(50, doc.y)
      .lineTo(doc.page.width - 50, doc.y)
      .strokeColor("#e5e7eb")
      .stroke();
    doc.moveDown(1);

    // The line that actually makes this receipt usable for a tax deduction
    // in most jurisdictions - always shown, not conditional on any setting.
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#374151")
      .text(
        "No goods or services were provided in exchange for this contribution. Please retain this receipt for your tax records."
      );
    doc.moveDown(1);

    const orgLines = [
      settings.orgAddress,
      [settings.orgPhone, settings.contactEmail].filter(Boolean).join("  ·  "),
      settings.orgRegistration ? `Registration: ${settings.orgRegistration}` : null,
    ].filter(Boolean);

    if (orgLines.length > 0) {
      doc.font("Helvetica-Bold").fontSize(9).fillColor("#6b7280").text("CHADI International");
      orgLines.forEach((line) => {
        doc.font("Helvetica").fontSize(9).fillColor("#9ca3af").text(line);
      });
      doc.moveDown(1);
    }

    if (settings.receiptSignatory) {
      doc.moveDown(1.5);
      const signatureY = doc.y;
      doc.moveTo(50, signatureY).lineTo(220, signatureY).strokeColor("#d1d5db").stroke();
      doc.moveDown(0.3);
      doc.font("Helvetica").fontSize(9).fillColor("#6b7280").text(settings.receiptSignatory);
      doc.moveDown(1);
    }

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#9ca3af")
      .text("This receipt was generated automatically at the time of payment.");

    doc.end();
  });
}
