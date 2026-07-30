import { useState } from "react";
import toast from "react-hot-toast";
import { Trans, useTranslation } from "react-i18next";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import Reveal from "../../components/common/Reveal";
import StaggerGrid, { StaggerItem } from "../../components/common/StaggerGrid";
import { submitVolunteerApplication } from "../../services/api";
import sparkImage from "../../assets/projects/digital-skills.jpg";
import Newsletter from "../../components/common/Newsletter";
import Honeypot from "../../components/common/Honeypot";

const AREA_KEYS = ["outreach", "health", "digital", "media", "research"];

function Volunteer() {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitting(true);

    try {
      await submitVolunteerApplication(Object.fromEntries(formData.entries()));
      form.reset();
      toast.success(t("volunteer.sentToast"));
    } catch {
      toast.error(t("volunteer.errorToast"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo
        title={t("volunteer.seoTitle")}
        path="/volunteer"
        description={t("volunteer.seoDescription")}
      />

      <PageHeader
        title={t("volunteer.title")}
        subtitle={t("volunteer.subtitle")}
      />

      <section
        className="relative overflow-hidden bg-chadi-green bg-cover bg-center py-16 text-white"
        style={{ backgroundImage: `url(${sparkImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-chadi-green/70 via-chadi-green/80 to-chadi-green/90" />
        <Reveal className="relative mx-auto max-w-5xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[3px] text-chadi-gold">
            {t("volunteer.spark.eyebrow")}
          </p>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            {t("volunteer.spark.heading")}
          </h2>
          <p className="mt-4 text-white/80">
            <Trans i18nKey="volunteer.spark.description" components={{ strong: <strong /> }} />
          </p>

          <StaggerGrid className="mt-10 grid gap-6 text-left sm:grid-cols-3">
            <StaggerItem>
              <div className="rounded-2xl bg-white/10 p-6">
                <h3 className="font-bold text-chadi-gold">{t("volunteer.spark.role.title")}</h3>
                <p className="mt-2 text-sm text-white/80">
                  {t("volunteer.spark.role.description")}
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-2xl bg-white/10 p-6">
                <h3 className="font-bold text-chadi-gold">{t("volunteer.spark.recognition.title")}</h3>
                <p className="mt-2 text-sm text-white/80">
                  {t("volunteer.spark.recognition.description")}
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-2xl bg-white/10 p-6">
                <h3 className="font-bold text-chadi-gold">{t("volunteer.spark.visibility.title")}</h3>
                <p className="mt-2 text-sm text-white/80">
                  {t("volunteer.spark.visibility.description")}
                </p>
              </div>
            </StaggerItem>
          </StaggerGrid>

          <p className="mt-8 text-sm text-white/70">
            {t("volunteer.spark.prompt")}
          </p>
        </Reveal>
      </section>

      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-3">
          <Reveal direction="left">
            <h2 className="text-3xl font-bold text-chadi-green sm:text-4xl">
              {t("volunteer.areasTitle")}
            </h2>
            <ul className="mt-6 space-y-4 leading-7 text-gray-600 dark:text-gray-300">
              {AREA_KEYS.map((key) => (
                <li key={key}>{t(`volunteer.areas.${key}`)}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            direction="right"
            delay={0.15}
            as="form"
            onSubmit={handleSubmit}
            className="rounded-3xl bg-chadi-cream p-8 shadow-lg lg:col-span-2"
          >
            <Honeypot />
            <div className="grid gap-5 md:grid-cols-2">
              <input
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
                name="name"
                placeholder={t("volunteer.form.namePlaceholder")}
                required
              />
              <input
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
                name="email"
                type="email"
                placeholder={t("volunteer.form.emailPlaceholder")}
                required
              />
              <input
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
                name="phone"
                placeholder={t("volunteer.form.phonePlaceholder")}
              />
              <input
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
                name="location"
                placeholder={t("volunteer.form.locationPlaceholder")}
              />
            </div>

            <select
              className="mt-5 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
              name="area"
              defaultValue=""
              required
            >
              <option value="" disabled>
                {t("volunteer.form.areaPlaceholder")}
              </option>
              <option>{t("volunteer.form.areaOutreach")}</option>
              <option>{t("volunteer.form.areaHealth")}</option>
              <option>{t("volunteer.form.areaEducation")}</option>
              <option>{t("volunteer.form.areaMedia")}</option>
              <option>{t("volunteer.form.areaResearch")}</option>
              <option>{t("volunteer.form.areaSpark")}</option>
            </select>

            <textarea
              className="mt-5 min-h-36 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
              name="message"
              placeholder={t("volunteer.form.messagePlaceholder")}
            />

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 rounded-lg bg-chadi-green px-8 py-3 font-semibold text-white transition hover:bg-chadi-gold hover:text-black disabled:opacity-60"
            >
              {submitting ? t("volunteer.form.submitting") : t("volunteer.form.submit")}
            </button>
          </Reveal>
        </div>
      </section>

      <Newsletter />
    </>
  );
}

export default Volunteer;
