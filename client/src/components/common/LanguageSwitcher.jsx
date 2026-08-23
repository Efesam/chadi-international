import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "../../i18n";

const NIGERIA_LANGUAGES = SUPPORTED_LANGUAGES.filter((lang) => lang.group === "nigeria");
const GLOBAL_LANGUAGES = SUPPORTED_LANGUAGES.filter((lang) => lang.group === "global");

/**
 * A real, working language switcher - not just a decorative dropdown. Only
 * as many languages as SUPPORTED_LANGUAGES actually has translations for
 * ever show up here (see i18n.js for how to add more). Grouped into
 * Nigerian/Global sections since 11 languages in one flat list gets hard to
 * scan.
 */
function LanguageSwitcher({ dark = false }) {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.resolvedLanguage}
      onChange={(event) => i18n.changeLanguage(event.target.value)}
      aria-label="Choose language"
      // min-h-11 gives the control a 44px tap target; at py-1 it rendered
      // only 27px tall, which is awkward to hit on a phone.
      className={`min-h-11 rounded-md border bg-transparent px-2 py-1 text-sm font-medium outline-none ${
        dark
          ? "border-white/40 text-white [&>option]:text-black"
          : "border-gray-300 text-gray-700 dark:text-gray-200"
      }`}
    >
      <optgroup label="Nigeria">
        {NIGERIA_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </optgroup>
      <optgroup label="Global">
        {GLOBAL_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </optgroup>
    </select>
  );
}

export default LanguageSwitcher;
