// i18n infrastructure. Navbar, Footer, Home and most other public pages are
// translated (see locales/en/common.json for the full key tree) - CMS
// content (project/news/event text typed by admins) is machine-translated
// server-side instead, see server/src/lib/translate.js.
//
// Nigeria's 4 main languages (English, Hausa, Yoruba, Igbo) plus 7 global
// core languages (French, Spanish, Arabic, Chinese, Russian, Portuguese,
// German - the UN's core languages plus Portuguese/German for donor-nation
// and diaspora reach). Machine-translated using common, low-ambiguity words
// for basic navigation. NONE of these have been reviewed by a native or
// professional speaker - do that before expanding any of them to cover
// program, health or safety content, where a translation mistake actually
// matters. This applies to every non-English language here, not just Hausa.
//
// To add a language: create client/src/locales/<code>/common.json with the
// same keys as en/common.json, import it below, and add it to `resources`
// and `SUPPORTED_LANGUAGES`.
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en/common.json";
import ha from "./locales/ha/common.json";
import yo from "./locales/yo/common.json";
import ig from "./locales/ig/common.json";
import fr from "./locales/fr/common.json";
import es from "./locales/es/common.json";
import ar from "./locales/ar/common.json";
import zh from "./locales/zh/common.json";
import ru from "./locales/ru/common.json";
import pt from "./locales/pt/common.json";
import de from "./locales/de/common.json";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", group: "nigeria" },
  { code: "ha", label: "Hausa", group: "nigeria" },
  { code: "yo", label: "Yorùbá", group: "nigeria" },
  { code: "ig", label: "Igbo", group: "nigeria" },
  { code: "fr", label: "Français", group: "global" },
  { code: "es", label: "Español", group: "global" },
  { code: "ar", label: "العربية", group: "global", rtl: true },
  { code: "zh", label: "中文", group: "global" },
  { code: "ru", label: "Русский", group: "global" },
  { code: "pt", label: "Português", group: "global" },
  { code: "de", label: "Deutsch", group: "global" },
];

const RTL_LANGUAGES = new Set(SUPPORTED_LANGUAGES.filter((lang) => lang.rtl).map((lang) => lang.code));

/** Keeps <html dir="..."> in sync with the active language - Arabic reads right-to-left, everything else left-to-right. */
function applyDirection(lng) {
  document.documentElement.dir = RTL_LANGUAGES.has(lng) ? "rtl" : "ltr";
  document.documentElement.lang = lng;
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      ha: { common: ha },
      yo: { common: yo },
      ig: { common: ig },
      fr: { common: fr },
      es: { common: es },
      ar: { common: ar },
      zh: { common: zh },
      ru: { common: ru },
      pt: { common: pt },
      de: { common: de },
    },
    ns: ["common"],
    defaultNS: "common",
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES.map((lang) => lang.code),
    interpolation: { escapeValue: false },
  });

applyDirection(i18n.resolvedLanguage);
i18n.on("languageChanged", applyDirection);

export default i18n;
