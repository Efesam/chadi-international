// i18n infrastructure. Only the Navbar's labels are translated so far (see
// Navbar.jsx for the working example) - this is a working starting point
// for expanding language support, not a claim that the whole site is
// translated yet.
//
// Hausa is included as a second language since it's widely spoken across
// CHADI's actual operating states (Gombe, Bauchi, Yobe), using common,
// low-ambiguity words for basic navigation. It has NOT been reviewed by a
// native or professional Hausa speaker - do that before expanding it to
// cover program, health or safety content, where a translation mistake
// actually matters.
//
// To add a language: create client/src/locales/<code>/common.json with the
// same keys as en/common.json, import it below, and add it to `resources`
// and `SUPPORTED_LANGUAGES`.
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en/common.json";
import ha from "./locales/ha/common.json";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ha", label: "Hausa" },
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      ha: { common: ha },
    },
    ns: ["common"],
    defaultNS: "common",
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES.map((lang) => lang.code),
    interpolation: { escapeValue: false },
  });

export default i18n;
