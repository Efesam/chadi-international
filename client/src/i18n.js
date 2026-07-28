// i18n infrastructure. English is the only complete language right now -
// this wires up the real mechanism (see Navbar for a working example) on a
// small set of strings rather than claiming multi-language support that
// doesn't exist yet.
//
// To add a language: create client/src/locales/<code>/common.json with the
// same keys as en/common.json, import it below, and add it to `resources`.
// Get it reviewed by a native/professional speaker before shipping it -
// machine-translating program, health or safety information for a real
// nonprofit's public site carries real accuracy risk that's worth avoiding.
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en/common.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
    },
    ns: ["common"],
    defaultNS: "common",
    fallbackLng: "en",
    supportedLngs: ["en"],
    interpolation: { escapeValue: false },
  });

export default i18n;
