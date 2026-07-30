import "@testing-library/jest-dom/vitest";
// Components call useTranslation()/t() throughout the app now - initialize
// the real i18n instance (falls back to English) so rendered text in tests
// matches what a browser actually shows, instead of raw translation keys.
import "../i18n";
