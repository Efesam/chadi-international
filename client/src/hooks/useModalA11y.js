import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Adds standard modal keyboard behavior to a dialog: Escape closes it, Tab
 * is trapped inside it while open, and focus returns to whatever triggered
 * it once closed. Returns a ref to attach to the modal's outer container.
 */
export function useModalA11y(open, onClose) {
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  // Callers (DonateModal, etc.) commonly pass an inline onClose that's a new
  // function on every render (e.g. wrapping it to also reset form state). A
  // ref lets the effect below read the latest onClose without depending on
  // its identity - otherwise every keystroke in the form re-triggers this
  // effect and steals focus back to the first focusable element mid-typing.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    triggerRef.current = document.activeElement;

    const container = containerRef.current;
    const focusable = container?.querySelectorAll(FOCUSABLE_SELECTOR);
    focusable?.[0]?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !container) return;

      const elements = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus?.();
    };
  }, [open]);

  return containerRef;
}
