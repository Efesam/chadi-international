import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import Reveal from "../../components/common/Reveal";
import {
  getDonorToken,
  donorLogout,
  requestDonorLink,
  getDonorDonations,
  cancelDonorSubscription,
  downloadDonorReceipt,
} from "../../services/api";

function formatAmount(entry) {
  const amount = Number(entry.amount || 0).toLocaleString();
  if (entry.currency === "USD") return `$${amount}`;
  return `₦${amount}`;
}

function LoginForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await requestDonorLink(email);
      setSent(true);
    } catch (error) {
      toast.error(error.message || t("donorPortal.login.genericError"));
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-2xl bg-chadi-cream p-8 text-center">
        <p className="font-semibold text-chadi-green dark:text-chadi-lightgreen">
          {t("donorPortal.login.sentTitle")}
        </p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {t("donorPortal.login.sentHint")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-chadi-cream p-8">
      <label className="block">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t("donorPortal.login.emailLabel")}</span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("donorPortal.login.emailPlaceholder")}
          className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white transition hover:bg-chadi-gold hover:text-black disabled:opacity-60"
      >
        {submitting ? t("donorPortal.login.sending") : t("donorPortal.login.submit")}
      </button>
      <p className="text-center text-xs text-gray-500 dark:text-gray-400">
        {t("donorPortal.login.hint")}
      </p>
    </form>
  );
}

function DonationRow({ entry, onCancelled }) {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadDonorReceipt(entry.id, `CHADI-receipt-${entry.reference || entry.id}.pdf`);
    } catch (error) {
      toast.error(error.message || t("donorPortal.dashboard.downloadError"));
    } finally {
      setDownloading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm(t("donorPortal.dashboard.cancelConfirm"))) return;
    setCancelling(true);
    try {
      await cancelDonorSubscription(entry.id);
      toast.success(t("donorPortal.dashboard.cancelSuccess"));
      onCancelled(entry.id);
    } catch (error) {
      toast.error(error.message || t("donorPortal.dashboard.cancelError"));
    } finally {
      setCancelling(false);
    }
  };

  const canCancel = entry.type === "subscription" && entry.subscriptionStatus === "active";

  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-4 pr-4 text-sm text-gray-600 dark:text-gray-300">
        {new Date(entry.createdAt).toLocaleDateString()}
      </td>
      <td className="py-4 pr-4 text-sm font-medium text-gray-900 dark:text-gray-50">
        {t(`donorPortal.typeLabels.${entry.type}`, { defaultValue: entry.type })}
      </td>
      <td className="py-4 pr-4 text-sm font-semibold text-chadi-green dark:text-chadi-lightgreen">
        {formatAmount(entry)}
        {entry.type === "subscription" && "/mo"}
      </td>
      <td className="py-4 pr-4 text-sm">
        {entry.type === "subscription" ? (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              entry.subscriptionStatus === "active"
                ? "bg-green-100 text-green-700"
                : entry.subscriptionStatus === "cancelled"
                ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {entry.subscriptionStatus === "active"
              ? t("donorPortal.dashboard.status.active")
              : entry.subscriptionStatus === "cancelled"
              ? t("donorPortal.dashboard.status.cancelled")
              : t("donorPortal.dashboard.status.activating")}
          </span>
        ) : (
          "—"
        )}
      </td>
      <td className="py-4 text-right text-sm">
        <div className="flex flex-wrap justify-end gap-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="rounded-lg border border-chadi-green px-3 py-1.5 text-xs font-semibold text-chadi-green transition hover:bg-chadi-green hover:text-white disabled:opacity-60 dark:border-chadi-lightgreen dark:text-chadi-lightgreen"
          >
            {downloading ? t("donorPortal.dashboard.downloading") : t("donorPortal.dashboard.downloadReceipt")}
          </button>
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
            >
              {cancelling ? t("donorPortal.dashboard.cancelling") : t("donorPortal.dashboard.cancel")}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function DonorDashboard({ onLogout }) {
  const { t } = useTranslation();
  const [donations, setDonations] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDonorDonations()
      .then(setDonations)
      .catch((err) => setError(err.message || t("donorPortal.dashboard.loadError")));
  }, [t]);

  const handleCancelled = (id) => {
    setDonations((prev) => prev.map((d) => (d.id === id ? { ...d, subscriptionStatus: "cancelled" } : d)));
  };

  const handleLogout = () => {
    donorLogout();
    onLogout();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-chadi-green dark:text-chadi-lightgreen">{t("donorPortal.dashboard.title")}</h2>
        <button
          onClick={handleLogout}
          className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-chadi-green"
        >
          {t("donorPortal.dashboard.signOut")}
        </button>
      </div>

      {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>}

      {!error && donations === null && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{t("donorPortal.dashboard.loading")}</p>
      )}

      {!error && donations !== null && donations.length === 0 && (
        <div className="rounded-2xl bg-chadi-cream p-8 text-center text-sm text-gray-600 dark:text-gray-300">
          {t("donorPortal.dashboard.empty")}
        </div>
      )}

      {!error && donations !== null && donations.length > 0 && (
        <div className="overflow-x-auto rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                <th className="pb-3 pr-4">{t("donorPortal.dashboard.columns.date")}</th>
                <th className="pb-3 pr-4">{t("donorPortal.dashboard.columns.type")}</th>
                <th className="pb-3 pr-4">{t("donorPortal.dashboard.columns.amount")}</th>
                <th className="pb-3 pr-4">{t("donorPortal.dashboard.columns.status")}</th>
                <th className="pb-3 text-right">{t("donorPortal.dashboard.columns.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((entry) => (
                <DonationRow key={entry.id} entry={entry} onCancelled={handleCancelled} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DonorPortal() {
  const { t } = useTranslation();
  const [signedIn, setSignedIn] = useState(() => Boolean(getDonorToken()));

  return (
    <>
      <Seo
        title={t("donorPortal.seoTitle")}
        path="/donor-portal"
        description={t("donorPortal.seoDescription")}
      />

      <PageHeader
        title={t("donorPortal.title")}
        subtitle={t("donorPortal.subtitle")}
      />

      <section className="bg-white py-16 dark:bg-gray-900">
        <Reveal className="mx-auto max-w-3xl px-6">
          {signedIn ? (
            <DonorDashboard onLogout={() => setSignedIn(false)} />
          ) : (
            <LoginForm />
          )}
        </Reveal>
      </section>
    </>
  );
}

export default DonorPortal;
