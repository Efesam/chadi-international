import { Link } from "react-router-dom";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import Reveal from "../../components/common/Reveal";
import Newsletter from "../../components/common/Newsletter";

function Terms() {
  return (
    <>
      <Seo
        title="Terms of Use"
        path="/terms"
        description="Guidelines and terms for using the CHADI International website."
      />

      <PageHeader
        title="Terms of Use"
        subtitle="Guidelines for using the CHADI International website."
      />

      <section className="bg-white py-20 dark:bg-gray-900">
        <Reveal className="mx-auto max-w-4xl space-y-8 px-6 leading-8 text-gray-600 dark:text-gray-300">
          <p className="rounded-xl bg-chadi-cream p-5 text-sm text-gray-600 dark:text-gray-300">
            This is a solid starting point, not a substitute for review by a
            qualified lawyer before you rely on it for compliance purposes.
          </p>

          <div>
            <h2 className="text-xl font-bold text-chadi-green">Using this site</h2>
            <p className="mt-3">
              This website shares information about CHADI's programs,
              projects, events and opportunities. Content is provided for
              general information and may be updated as programs evolve. You
              agree not to misuse the site, submit false information through
              its forms, or attempt to disrupt the platform or the services it
              connects to.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-chadi-green">Content and intellectual property</h2>
            <p className="mt-3">
              Text, photos and other content on this site belong to CHADI
              International or are used with permission, unless stated
              otherwise. You're welcome to share links to our content; reusing
              it elsewhere requires our written permission first.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-chadi-green">Donations</h2>
            <p className="mt-3">
              Donations made through this site are voluntary contributions to
              CHADI International's work. Payments are processed securely by
              Paystack; we never see or store your card details. If you made
              a donation in error or have a concern about a charge, contact us
              through the{" "}
              <Link to="/contact" className="font-semibold text-chadi-green underline">
                Contact page
              </Link>{" "}
              and we'll work with you on it.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-chadi-green">Third-party links</h2>
            <p className="mt-3">
              This site may link to third-party websites (partner
              organizations, social media, payment providers). We aren't
              responsible for the content or practices of sites we don't
              control.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-chadi-green">No warranty; limitation of liability</h2>
            <p className="mt-3">
              This site and its content are provided "as is," without
              warranties of any kind. To the fullest extent permitted by law,
              CHADI International is not liable for any indirect or
              consequential loss arising from your use of this site.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-chadi-green">Governing law</h2>
            <p className="mt-3">
              These terms are governed by the laws of the Federal Republic of
              Nigeria, without regard to conflict-of-law principles.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-chadi-green">Changes to these terms</h2>
            <p className="mt-3">
              CHADI may update these terms as the website and services grow.
              Continued use of the site after a change means you accept the
              updated terms.
            </p>
          </div>
        </Reveal>
      </section>

      <Newsletter />
    </>
  );
}

export default Terms;
