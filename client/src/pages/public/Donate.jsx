import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import { recordDonationInterest } from "../../services/api";
import DonateModal from "../../components/common/DonateModal";
import Reveal from "../../components/common/Reveal";
import Newsletter from "../../components/common/Newsletter";
import Honeypot from "../../components/common/Honeypot";
import ImpactCalculator from "../../components/common/ImpactCalculator";

function InterestForm() {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitting(true);

    try {
      await recordDonationInterest(Object.fromEntries(formData.entries()));
      form.reset();
      toast.success(t("donate.interestForm.sentToast"));
    } catch {
      toast.error(t("donate.interestForm.errorToast"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-chadi-cream p-8 shadow-lg"
    >
      <h3 className="text-2xl font-bold text-chadi-green dark:text-chadi-lightgreen">{t("donate.interestForm.title")}</h3>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        {t("donate.interestForm.description")}
      </p>

      <Honeypot />
      <input
        className="mt-6 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
        name="name"
        placeholder={t("donate.interestForm.namePlaceholder")}
        required
      />
      <input
        className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
        name="email"
        type="email"
        placeholder={t("donate.interestForm.emailPlaceholder")}
        required
      />
      <select
        className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
        name="interest"
        defaultValue=""
        required
      >
        <option value="" disabled>
          {t("donate.interestForm.interestPlaceholder")}
        </option>
        <option>{t("donate.interestForm.corporateSponsorship")}</option>
        <option>{t("donate.interestForm.programPartnership")}</option>
        <option>{t("donate.interestForm.inKindDonation")}</option>
      </select>

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white transition hover:scale-105 hover:bg-chadi-gold hover:text-black disabled:opacity-60"
      >
        {submitting ? t("donate.interestForm.saving") : t("donate.interestForm.submit")}
      </button>

      <Link
        to="/contact"
        className="ml-4 inline-block font-semibold text-chadi-green hover:text-chadi-gold-dark dark:text-chadi-lightgreen dark:hover:text-chadi-gold"
      >
        {t("donate.interestForm.contactInstead")}
      </Link>
    </form>
  );
}

function Donate() {
  const { t } = useTranslation();
  const [donateOpen, setDonateOpen] = useState(false);

  return (
    <>
      <Seo
        title={t("donate.seoTitle")}
        path="/donate"
        description={t("donate.seoDescription")}
      />

      <PageHeader
        title={t("donate.pageTitle")}
        subtitle={t("donate.pageSubtitle")}
      />

      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-2">
          <Reveal direction="left">
            <div>
              <h2 className="text-3xl font-bold text-chadi-green sm:text-4xl dark:text-chadi-lightgreen">
                {t("donate.heading")}
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                {t("donate.description")}
              </p>

              <button
                type="button"
                onClick={() => setDonateOpen(true)}
                className="mt-8 rounded-full bg-chadi-green px-8 py-4 font-semibold text-white transition hover:scale-105 hover:bg-chadi-gold hover:text-black"
              >
                {t("donate.donateNow")}
              </button>
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.15}>
            <div className="space-y-8">
              <InterestForm />
            </div>
          </Reveal>
        </div>
      </section>

      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />

      <ImpactCalculator />

      <Newsletter />
    </>
  );
}

export default Donate;
