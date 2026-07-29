import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "../../i18n";

/**
 * A real, working language switcher - not just a decorative dropdown. Only
 * as many languages as SUPPORTED_LANGUAGES actually has translations for
 * ever show up here (see i18n.js for how to add more).
 */
function LanguageSwitcher({ dark = false }) {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.resolvedLanguage}
      onChange={(event) => i18n.changeLanguage(event.target.value)}
      aria-label="Choose language"
      className={`rounded-md border bg-transparent px-2 py-1 text-sm font-medium outline-none ${
        dark
          ? "border-white/40 text-white [&>option]:text-black"
          : "border-gray-300 text-gray-700"
      }`}
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}

export default LanguageSwitcher;
