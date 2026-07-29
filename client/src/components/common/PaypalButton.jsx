import { useEffect, useRef, useState } from "react";
import { createPaypalOrder, capturePaypalOrder } from "../../services/api";

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

let sdkPromise = null;

function loadPaypalSdk() {
  if (window.paypal) return Promise.resolve(window.paypal);
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(PAYPAL_CLIENT_ID)}&currency=USD`;
    script.onload = () => resolve(window.paypal);
    script.onerror = () => reject(new Error("Could not load PayPal"));
    document.body.appendChild(script);
  });

  return sdkPromise;
}

/**
 * A "Pay with PayPal" option for one-time donations, alongside the Paystack
 * button - an alternative for donors who'd rather not enter a card directly
 * (common for international/diaspora givers). Renders nothing at all unless
 * VITE_PAYPAL_CLIENT_ID is set, same "quietly does nothing until configured"
 * pattern as Paystack. Only one-time giving - Hope Alive Circle's monthly
 * subscriptions stay Paystack-only for now.
 */
function PaypalButton({ amount, project, onResult }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  // The PayPal SDK's button instance is only created once (see the effect
  // below) - its callbacks read the latest amount/project/onResult through
  // this ref rather than closing over the props as they were at mount time,
  // so changing the donation amount after the button renders still works.
  const latest = useRef({ amount, project, onResult });
  useEffect(() => {
    latest.current = { amount, project, onResult };
  });

  useEffect(() => {
    if (!PAYPAL_CLIENT_ID || !containerRef.current) return undefined;

    let buttons;
    let cancelled = false;

    loadPaypalSdk()
      .then((paypal) => {
        if (cancelled || !containerRef.current) return;

        buttons = paypal.Buttons({
          style: { layout: "horizontal", height: 45, tagline: false },
          createOrder: async () => {
            const { amount: currentAmount, project: currentProject } = latest.current;
            const { orderId } = await createPaypalOrder({
              amount: currentAmount,
              currency: "USD",
              projectId: currentProject?.id,
              projectTitle: currentProject?.title,
            });
            return orderId;
          },
          onApprove: async (data) => {
            const { project: currentProject, onResult: currentOnResult } = latest.current;
            const result = await capturePaypalOrder({
              orderId: data.orderID,
              projectId: currentProject?.id,
              projectTitle: currentProject?.title,
            });
            currentOnResult({
              type: "success",
              amount: result.amount,
              reference: result.reference,
            });
          },
          onError: () => {
            latest.current.onResult({
              type: "error",
              message: "PayPal payment could not be completed. Please try again.",
            });
          },
        });

        buttons.render(containerRef.current);
      })
      .catch(() => setError("PayPal could not be loaded right now."));

    return () => {
      cancelled = true;
      buttons?.close?.();
    };
  }, []);

  if (!PAYPAL_CLIENT_ID) return null;

  return (
    <div className="mt-3">
      {error ? <p className="text-xs text-red-600">{error}</p> : <div ref={containerRef} />}
    </div>
  );
}

export default PaypalButton;
