/**
 * A hidden field for public forms - real visitors never see or fill it, but
 * basic spam bots that auto-fill every input on a form do, outing
 * themselves. Paired with the matching check in the server's
 * createSubmissionRouter (see HONEYPOT_FIELD there - the two names must
 * match). Positioned off-screen rather than display:none/visibility:hidden,
 * since some bots skip fields hidden that way; kept out of tab order and
 * hidden from screen readers either way.
 *
 * Uncontrolled by default (works with FormData-based forms - just needs to
 * be inside the <form>). Pass `value`/`onChange` for forms built on
 * controlled React state instead.
 */
function Honeypot({ value, onChange }) {
  return (
    <input
      type="text"
      name="hp_field"
      {...(value !== undefined ? { value, onChange } : {})}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
    />
  );
}

export default Honeypot;
