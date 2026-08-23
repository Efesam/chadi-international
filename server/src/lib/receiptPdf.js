import PDFDocument from "pdfkit";
import { fileURLToPath } from "node:url";
import { buildImpactMessage, SIGNATURE } from "./receiptImpact.js";

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

    const LEFT = 50;
    const RIGHT = doc.page.width - 50;
    const CONTENT_W = RIGHT - LEFT;

    // ---------- Header band ----------
    doc.rect(0, 0, doc.page.width, 90).fill(GREEN);
    doc.image(LOGO_PATH, LEFT, 20, { width: 50, height: 50 });
    doc.fillColor("#ffffff").fontSize(20).font("Helvetica-Bold").text("CHADI International", 112, 30);
    doc.fontSize(11).font("Helvetica").fillColor(GOLD).text("Donation Receipt", 112, 56);

    // Receipt number + date sit in the header, right-aligned - standard
    // placement on a receipt/invoice, and it frees the body for content.
    if (entry.receiptNumber) {
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor("#ffffff")
        .opacity(0.75)
        .text("RECEIPT NO.", RIGHT - 200, 30, { width: 200, align: "right" });
      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor("#ffffff")
        .opacity(1)
        .text(entry.receiptNumber, RIGHT - 200, 42, { width: 200, align: "right" });
    }
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#ffffff")
      .opacity(0.75)
      .text(date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), RIGHT - 200, 60, {
        width: 200,
        align: "right",
      });
    doc.opacity(1);

    doc.y = 120;
    doc.fillColor("#1f2937").font("Helvetica-Bold").fontSize(15);
    doc.text(isSubscription ? "Thank you for joining Hope Alive Circle" : "Thank you for your donation", LEFT);
    doc.moveDown(0.9);

    // ---------- Amount, given the emphasis a receipt's key figure needs ----------
    const amountBoxY = doc.y;
    const amountBoxH = 58;
    doc.roundedRect(LEFT, amountBoxY, CONTENT_W, amountBoxH, 6).fill("#f0f7ee");
    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor("#6b7280")
      .text("AMOUNT RECEIVED", LEFT + 16, amountBoxY + 12, { characterSpacing: 0.6 });
    doc.font("Helvetica-Bold").fontSize(22).fillColor(GREEN);
    // Measured while the 22pt bold face is still active - measuring after
    // switching to the 9pt face returns the width of the amount *at 9pt*,
    // which put the "per month" suffix on top of the amount itself.
    const amountWidth = doc.widthOfString(amount);
    doc.text(amount, LEFT + 16, amountBoxY + 26);
    if (isSubscription) {
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#6b7280")
        .text("per month", LEFT + 16 + amountWidth + 8, amountBoxY + 40);
    }
    doc.y = amountBoxY + amountBoxH + 18;

    // ---------- Details, two columns instead of one tall stack ----------
    const pair = (label, value, x, y, width) => {
      if (!value) return y;
      doc.font("Helvetica-Bold").fontSize(8).fillColor("#9ca3af").text(label.toUpperCase(), x, y, { width });
      doc.font("Helvetica").fontSize(10.5).fillColor("#1f2937").text(String(value), x, y + 11, { width });
      return y + 11 + doc.heightOfString(String(value), { width }) + 12;
    };

    const colW = (CONTENT_W - 30) / 2;
    const colX2 = LEFT + colW + 30;
    let yL = doc.y;
    let yR = doc.y;

    yL = pair("Donor", entry.name || entry.email, LEFT, yL, colW);
    yL = pair("Email", entry.email, LEFT, yL, colW);
    if (entry.projectTitle) yL = pair("Designated to", entry.projectTitle, LEFT, yL, colW);

    // No "Date received" row here on purpose - the date is already printed
    // in the header alongside the receipt number, and repeating it made the
    // same value appear twice on one short document.
    yR = pair("Payment method", paymentMethod, colX2, yR, colW);
    yR = pair("Transaction reference", entry.reference, colX2, yR, colW);

    doc.y = Math.max(yL, yR) + 4;
    doc.x = LEFT;

    // buildImpactMessage appends the shared sign-off (see receiptImpact.js's
    // SIGNATURE) because the *emails* need it inline. This PDF prints its own
    // formal signature block further down, so when a signatory is configured
    // the letter's sign-off is dropped - otherwise the same name and title
    // appear twice within a few centimetres of each other.
    const fullLetter = buildImpactMessage(entry, { project, settings });
    const signOffDropped = Boolean(fullLetter && settings.receiptSignatory);
    const letterParagraphs = signOffDropped
      ? fullLetter.slice(0, Math.max(0, fullLetter.length - SIGNATURE.length))
      : fullLetter;

    if (letterParagraphs && letterParagraphs.length) {
      doc.font("Helvetica-Bold").fontSize(9).fillColor(GREEN).text("WITH GRATITUDE", LEFT, doc.y, { characterSpacing: 0.6 });
      doc.moveDown(0.5);
      doc.font("Helvetica").fontSize(9.5).fillColor("#374151");
      // The tighter gap only belongs between the sign-off's name and title.
      // When the sign-off has been dropped there is no such pair left, and
      // applying it by index alone jammed the last two real paragraphs.
      const tightAfter = signOffDropped ? -1 : letterParagraphs.length - 2;
      letterParagraphs.forEach((paragraph, index) => {
        doc.text(paragraph, LEFT, doc.y, { width: CONTENT_W, align: "left" });
        doc.moveDown(index === tightAfter ? 0.15 : 0.4);
      });
      doc.moveDown(0.4);
    }

    if (isSubscription) {
      doc
        .font("Helvetica-Oblique")
        .fontSize(9)
        .fillColor("#6b7280")
        .text("This receipt confirms one monthly installment of an ongoing Hope Alive Circle pledge.", LEFT, doc.y, {
          width: CONTENT_W,
        });
      doc.moveDown(0.8);
    }

    // ---------- Legal / org footer, kept together ----------
    // Measured up front and moved to a fresh page as one unit if it won't
    // fit. Previously this just flowed, which is how a receipt ended up
    // spilling a single orphaned sentence onto an otherwise blank page 2.
    const orgLines = [
      settings.orgAddress,
      [settings.orgPhone, settings.contactEmail].filter(Boolean).join("  ·  "),
      settings.orgRegistration ? `Registration: ${settings.orgRegistration}` : null,
    ].filter(Boolean);

    const taxStatement =
      "No goods or services were provided in exchange for this contribution. Please retain this receipt for your tax records.";

    doc.font("Helvetica").fontSize(9);
    const footerHeight =
      14 + // divider + padding
      doc.heightOfString(taxStatement, { width: CONTENT_W }) +
      14 +
      (orgLines.length ? 12 + orgLines.length * 12 + 10 : 0) +
      (settings.receiptSignatory ? 46 : 0) +
      22; // closing note

    if (doc.y + footerHeight > doc.page.height - 50) {
      doc.addPage();
      doc.y = 60;
    }

    doc.moveDown(0.5);
    doc.moveTo(LEFT, doc.y).lineTo(RIGHT, doc.y).strokeColor("#e5e7eb").stroke();
    doc.moveDown(1);

    // The line that actually makes this receipt usable for a tax deduction
    // in most jurisdictions - always shown, not conditional on any setting.
    doc.font("Helvetica").fontSize(9).fillColor("#374151").text(taxStatement, LEFT, doc.y, { width: CONTENT_W });
    doc.moveDown(1);

    if (orgLines.length > 0) {
      doc.font("Helvetica-Bold").fontSize(9).fillColor("#6b7280").text("CHADI International", LEFT, doc.y);
      orgLines.forEach((line) => {
        doc.font("Helvetica").fontSize(9).fillColor("#9ca3af").text(line, LEFT, doc.y, { width: CONTENT_W });
      });
      doc.moveDown(1);
    }

    if (settings.receiptSignatory) {
      doc.moveDown(1.2);
      const signatureY = doc.y;
      doc.moveTo(LEFT, signatureY).lineTo(LEFT + 170, signatureY).strokeColor("#d1d5db").stroke();
      doc.y = signatureY + 5;
      doc.font("Helvetica").fontSize(9).fillColor("#6b7280").text(settings.receiptSignatory, LEFT, doc.y);
      doc.moveDown(0.9);
    }

    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor("#9ca3af")
      .text("This receipt was generated automatically at the time of payment.", LEFT, doc.y, { width: CONTENT_W });

    doc.end();
  });
}
