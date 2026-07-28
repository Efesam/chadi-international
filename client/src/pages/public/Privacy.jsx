import { Link } from "react-router-dom";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import Reveal from "../../components/common/Reveal";
import Newsletter from "../../components/common/Newsletter";

function Privacy() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        path="/privacy"
        description="Read CHADI International's privacy policy covering how information shared through this website is handled."
      />

      <PageHeader
        title="Privacy Policy"
        subtitle="How CHADI handles information shared through this website."
      />

      <section className="bg-white py-20">
        <Reveal className="mx-auto max-w-4xl space-y-8 px-6 leading-8 text-gray-600">
          <p className="rounded-xl bg-chadi-cream p-5 text-sm text-gray-600">
            Last updated: this policy describes how this website actually
            handles information today. It's a solid starting point, not a
            substitute for review by a qualified lawyer before you rely on it
            for compliance purposes.
          </p>

          <div>
            <h2 className="text-xl font-bold text-chadi-green">Information we collect</h2>
            <p className="mt-3">
              We collect what you choose to submit through this site's forms:
              your name and email on the contact, volunteer, newsletter and
              donation-interest forms, plus whatever else a specific form asks
              for (e.g. your area of interest when volunteering). If you make a
              donation, Paystack (our payment processor) shares your name,
              email, donation amount and a payment reference with us so we can
              record the donation and send you a receipt - your card details
              are entered directly into Paystack's own checkout and never pass
              through our servers.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-chadi-green">Cookies</h2>
            <p className="mt-3">
              This site itself does not set tracking cookies. If you accept
              the cookie banner, we load privacy-focused, cookie-free
              analytics (Plausible) to understand overall traffic - it does
              not use cookies or track you individually across sites. The
              admin dashboard keeps staff signed in using your browser's local
              storage, not a cookie. Paystack's checkout may set its own
              cookies on its own domain while you're completing a payment,
              governed by Paystack's privacy policy, not ours.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-chadi-green">How we use your information</h2>
            <p className="mt-3">
              To respond to inquiries, process and receipt donations, follow
              up on volunteer applications, send newsletter updates you've
              signed up for, and operate the site's basic functions. We do not
              sell personal information, and we don't use what you share for
              anything beyond these purposes without asking you first.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-chadi-green">Who we share it with</h2>
            <p className="mt-3">
              Only the third parties needed to provide the service you asked
              for: Paystack (payment processing), our email service provider
              (sending receipts, replies and newsletter emails), and, if
              enabled, Plausible (analytics) and Sentry (error monitoring, to
              help us fix bugs). We don't sell or rent your information to
              anyone else. Access within CHADI is limited to team members who
              need it to do their work.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-chadi-green">How long we keep it</h2>
            <p className="mt-3">
              We keep submitted information for as long as it's useful for the
              purpose you shared it for (e.g. an active volunteer application,
              donation records for our own accounting), or until you ask us to
              delete it - whichever is relevant.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-chadi-green">Your rights</h2>
            <p className="mt-3">
              Depending on where you're located, you may have the right to
              access, correct, delete, or receive a copy of the information
              we hold about you, or to object to how it's used. To exercise
              any of these, or to update or remove information you've shared
              with us, contact us through the{" "}
              <Link to="/contact" className="font-semibold text-chadi-green underline">
                Contact page
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-chadi-green">Children's privacy</h2>
            <p className="mt-3">
              This site is not directed at children, and we do not knowingly
              collect personal information from children.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-chadi-green">Changes to this policy</h2>
            <p className="mt-3">
              We may update this policy as the site and our services evolve.
              Significant changes will be reflected here with an updated date.
            </p>
          </div>
        </Reveal>
      </section>

      <Newsletter />
    </>
  );
}

export default Privacy;
