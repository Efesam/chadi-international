import { useState } from "react";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FaShieldAlt, FaCheck } from "react-icons/fa";
import { verifyPayment, getOrCreateMonthlyPlan, reportPaymentIssue, downloadReceiptByReference } from "../../services/api";
import { IMPACT_TIERS } from "../../data/impactTiers";
import PaypalButton from "./PaypalButton";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
const PAYPAL_ENABLED = Boolean(import.meta.env.VITE_PAYPAL_CLIENT_ID);
const USD_PRESETS = [10, 25, 50, 100];
const PRESET_AMOUNTS = IMPACT_TIERS;

/**
 * Replaces the donation form once a payment is confirmed - a distinct
 * "you're done" screen (checkmark animation, receipt download, done button)
 * rather than a plain inline message, so the donor gets a clear, satisfying
 * exit from the flow instead of being left looking at the form they just
 * submitted.
 */
function DonationSuccess({ result, onDone }) {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadReceiptByReference(result.reference, `CHADI-receipt-${result.reference}.pdf`);
    } catch (err) {
      toast.error(err.message || t("donateModal.success.downloadError"));
    } finally {
      setDownloading(false);
    }
  };

  const currencySymbol = result.currency === "USD" ? "$" : "₦";
  const amountLabel = `${currencySymbol}${Number(result.amount || 0).toLocaleString()}`;

  return (
    <div className="flex flex-col items-center py-4 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-chadi-green"
      >
        <FaCheck className="text-3xl text-white" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
        <h3 id="donate-form-title" className="mt-6 text-2xl font-bold text-chadi-green dark:text-chadi-lightgreen">
          {t("donateModal.success.title")}
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {result.isSubscription
            ? t("donateModal.success.subscriptionMessage", { amount: amountLabel })
            : t("donateModal.success.oneTimeMessage", { amount: amountLabel })}
        </p>
        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
          {t("donateModal.success.reference", { reference: result.reference })}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 rounded-lg border border-chadi-green px-6 py-3 text-sm font-semibold text-chadi-green transition hover:bg-chadi-green hover:text-white disabled:opacity-60 dark:border-chadi-lightgreen dark:text-chadi-lightgreen"
          >
            {downloading ? t("donateModal.success.downloading") : t("donateModal.success.downloadReceipt")}
          </button>
          <button
            type="button"
            onClick={onDone}
            className="flex-1 rounded-lg bg-chadi-green px-6 py-3 text-sm font-semibold text-white transition hover:bg-chadi-gold hover:text-black"
          >
            {t("donateModal.success.done")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * The actual donation form - amount/frequency, Paystack, PayPal, and the
 * success screen. Shared between DonateModal (popup, general donations only)
 * and ProjectDonate (full page, project-specific donations) so the payment
 * logic lives in exactly one place. `showHeader` is off for the full-page
 * case, which already shows the project's name/story of its own accord.
 *
 * If a caller wants a fresh `initialAmount` picked up after the first mount
 * (e.g. ImpactCalculator's slider changing while the form isn't mounted yet),
 * pass a `key` that changes along with it - remounting the component is
 * simpler and avoids an extra effect just to resync state.
 */
function DonateForm({ project, initialAmount, showHeader = true, onDone }) {
  const { t } = useTranslation();
  // Monthly (Hope Alive Circle) is the default and the primary path - recurring
  // giving is what CHADI actually plans against, so the form opens on it rather
  // than making it the secondary option a donor has to go looking for.
  const [frequency, setFrequency] = useState("monthly");
  const [amount, setAmount] = useState(initialAmount || "5000");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [paying, setPaying] = useState(false);
  const [result, setResult] = useState(null);
  // Separate from `amount` (Naira, for Paystack) on purpose - PayPal charges
  // in USD, and the two currencies aren't the same number.
  const [usdAmount, setUsdAmount] = useState("25");

  const configured = Boolean(PAYSTACK_PUBLIC_KEY) && typeof window !== "undefined" && window.PaystackPop;

  const activeTier = PRESET_AMOUNTS.find((p) => p.amount === Number(amount));
  const activeLabel = activeTier && t(`impactTiers.${activeTier.key}.label`);

  // Resets the form back to a blank slate once the donor is done, so if this
  // instance stays mounted (a popup reopened, or a full page the donor could
  // conceivably use again) it shows a fresh form rather than the last result.
  const handleDone = () => {
    setResult(null);
    setName("");
    setEmail("");
    setAmount(initialAmount || "5000");
    setUsdAmount("25");
    setFrequency("monthly");
    onDone?.();
  };

  const handlePayOnce = (event) => {
    event.preventDefault();

    const nairaAmount = Number(amount);
    if (!nairaAmount || nairaAmount < 100) {
      setResult({ type: "error", message: t("donateModal.minAmountError") });
      return;
    }

    setPaying(true);
    setResult(null);

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email,
      amount: Math.round(nairaAmount * 100),
      currency: "NGN",
      metadata: { name, projectId: project?.id, projectTitle: project?.title },
      callback: (response) => {
        verifyPayment(response.reference)
          .then((data) => {
            setResult({
              type: "success",
              amount: data.amount,
              reference: data.reference,
              currency: "NGN",
              isSubscription: false,
            });
          })
          .catch(() => {
            // Best-effort, fire-and-forget - a donor was genuinely charged
            // but we couldn't confirm it, so staff need to know even if this
            // report call itself fails for some reason.
            reportPaymentIssue({
              reference: response.reference,
              name,
              email,
              amount: nairaAmount,
              frequency: "once",
              projectTitle: project?.title,
            }).catch(() => {});

            setResult({
              type: "error",
              message: t("donateModal.verifyErrorOnce", { reference: response.reference }),
            });
          })
          .finally(() => setPaying(false));
      },
      onClose: () => setPaying(false),
    });

    handler.openIframe();
  };

  // Joining Hope Alive Circle creates a real recurring subscription: the
  // server finds or creates a Paystack Plan for this amount, then the popup
  // is opened against that plan (instead of a one-off amount). Paystack
  // tokenizes the donor's card on the first charge and automatically bills
  // it again every month afterwards - no further action needed here or on
  // the server beyond recording each charge as it comes in (see the
  // charge.success webhook handler on the server).
  const handleJoinMonthly = async (event) => {
    event.preventDefault();

    const nairaAmount = Number(amount);
    if (!nairaAmount || nairaAmount < 100) {
      setResult({ type: "error", message: t("donateModal.minAmountError") });
      return;
    }

    setPaying(true);
    setResult(null);

    try {
      const { planCode } = await getOrCreateMonthlyPlan(nairaAmount);

      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email,
        plan: planCode,
        currency: "NGN",
        metadata: { name, projectId: project?.id, projectTitle: project?.title, interval: "monthly" },
        callback: (response) => {
          verifyPayment(response.reference)
            .then((data) => {
              setResult({
                type: "success",
                amount: data.amount,
                reference: data.reference,
                currency: "NGN",
                isSubscription: true,
              });
            })
            .catch(() => {
              reportPaymentIssue({
                reference: response.reference,
                name,
                email,
                amount: nairaAmount,
                frequency: "monthly",
                projectTitle: project?.title,
              }).catch(() => {});

              setResult({
                type: "error",
                message: t("donateModal.verifyErrorMonthly", { reference: response.reference }),
              });
            })
            .finally(() => setPaying(false));
        },
        onClose: () => setPaying(false),
      });

      handler.openIframe();
    } catch (err) {
      setPaying(false);
      setResult({
        type: "error",
        message: err.message || t("donateModal.monthlySetupError"),
      });
    }
  };

  const handlePaypalResult = (paypalResult) => {
    if (paypalResult.type === "success") {
      setResult({
        type: "success",
        amount: paypalResult.amount,
        reference: paypalResult.reference,
        currency: "USD",
        isSubscription: false,
      });
    } else {
      setResult(paypalResult);
    }
  };

  if (result?.type === "success") {
    return <DonationSuccess result={result} onDone={handleDone} />;
  }

  return (
    <>
      {showHeader && (
        <>
          <p className="text-xs font-bold uppercase tracking-[3px] text-chadi-gold-dark dark:text-chadi-gold">{t("donateModal.orgName")}</p>
          <h3 id="donate-form-title" className="mt-2 text-3xl font-bold text-chadi-green dark:text-chadi-lightgreen">
            {t("donateModal.title")}
          </h3>
          {project?.title ? (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {t("donateModal.supporting")} <span className="font-semibold text-chadi-green dark:text-chadi-lightgreen">{project.title}</span>
            </p>
          ) : (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {t("donateModal.genericSubtitle")}
            </p>
          )}
        </>
      )}

      {/* Hope Alive Circle sits first and carries the "recommended" flag -
          it's the option CHADI wants donors to land on, so it leads rather
          than sitting second behind one-off giving. */}
      <div className="mt-5 flex rounded-lg bg-gray-100 p-1 text-sm font-semibold dark:bg-gray-700">
        <button
          type="button"
          onClick={() => setFrequency("monthly")}
          className={`flex flex-1 flex-col items-center rounded-md px-2 py-2 leading-tight transition ${
            frequency === "monthly" ? "bg-white text-chadi-green shadow-sm" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <span>{t("donateModal.monthly")}</span>
          <span
            className={`text-[10px] font-bold uppercase tracking-wide ${
              frequency === "monthly" ? "text-chadi-gold-dark dark:text-chadi-gold" : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {t("donateModal.recommended")}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setFrequency("once")}
          className={`flex-1 rounded-md px-2 py-2 transition ${
            frequency === "once" ? "bg-white text-chadi-green shadow-sm" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {t("donateModal.oneTime")}
        </button>
      </div>

      <form onSubmit={frequency === "once" ? handlePayOnce : handleJoinMonthly} className="mt-5 space-y-4">
        <input
          type="text"
          required
          placeholder={t("donateModal.namePlaceholder")}
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-chadi-green"
        />
        <input
          type="email"
          required
          placeholder={t("donateModal.emailPlaceholder")}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-chadi-green"
        />
        <input
          type="number"
          min="100"
          step="100"
          required
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-chadi-green"
        />

        <div className="grid grid-cols-2 gap-2">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset.amount}
              type="button"
              onClick={() => setAmount(String(preset.amount))}
              className={`rounded-lg border px-3 py-2 text-left transition ${
                Number(amount) === preset.amount
                  ? "border-chadi-green bg-chadi-green/5"
                  : "border-gray-200 hover:border-chadi-green"
              }`}
            >
              <span className="block text-sm font-bold text-chadi-green dark:text-chadi-lightgreen">
                ₦{preset.amount.toLocaleString()}
              </span>
              <span className="block text-[11px] leading-tight text-gray-500 dark:text-gray-400">{t(`impactTiers.${preset.key}.label`)}</span>
            </button>
          ))}
        </div>

        {activeLabel && <p className="text-xs font-semibold text-chadi-green dark:text-chadi-lightgreen">{activeLabel}</p>}

        {frequency === "monthly" && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t("donateModal.monthlyNote", { amount: Number(amount || 0).toLocaleString() })}
          </p>
        )}

        {!configured ? (
          <p className="rounded-lg bg-yellow-50 p-3 text-xs text-yellow-800">
            {t("donateModal.notConfigured")}
          </p>
        ) : (
          <button
            type="submit"
            disabled={paying}
            className="w-full rounded-lg bg-chadi-green px-6 py-3 text-sm font-semibold text-white transition hover:bg-chadi-gold hover:text-black disabled:opacity-60"
          >
            {paying
              ? t("donateModal.processing")
              : frequency === "once"
              ? t("donateModal.giveButton", { amount: Number(amount || 0).toLocaleString() })
              : t("donateModal.joinButton", { amount: Number(amount || 0).toLocaleString() })}
          </button>
        )}

        <p className="flex items-center justify-center gap-2 text-center text-xs text-gray-400 dark:text-gray-500">
          <FaShieldAlt /> {t("donateModal.securedBy")}
        </p>

        {PAYPAL_ENABLED && frequency === "once" && (
          <div className="border-t border-gray-100 pt-4">
            <p className="text-center text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              {t("donateModal.internationalPrompt")}
            </p>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {USD_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setUsdAmount(String(preset))}
                  className={`rounded-lg border py-2 text-sm font-bold transition ${
                    Number(usdAmount) === preset
                      ? "border-chadi-green bg-chadi-green/5 text-chadi-green dark:border-chadi-lightgreen dark:text-chadi-lightgreen"
                      : "border-gray-200 text-gray-600 dark:text-gray-300 hover:border-chadi-green"
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>

            <PaypalButton amount={usdAmount} project={project} onResult={handlePaypalResult} />
          </div>
        )}

        {result?.type === "error" && <p className="text-sm font-semibold text-red-600">{result.message}</p>}
      </form>
    </>
  );
}

export default DonateForm;
