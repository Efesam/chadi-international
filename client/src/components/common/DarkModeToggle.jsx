import { FaMoon, FaSun } from "react-icons/fa";
import { useDarkMode } from "../../hooks/useDarkMode";

/**
 * Sun/moon toggle button - mirrors LanguageSwitcher's `dark` prop (named
 * for "on a dark/transparent navbar background", not the color theme) so
 * both stay legible whether the navbar is transparent-over-hero or scrolled
 * to solid white/dark.
 */
function DarkModeToggle({ dark = false }) {
  const { isDark, toggle } = useDarkMode();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`text-lg transition ${
        dark
          ? "text-white hover:text-chadi-gold"
          : "text-gray-700 dark:text-gray-200 hover:text-chadi-green dark:text-gray-200 dark:hover:text-chadi-gold"
      }`}
    >
      {isDark ? <FaSun /> : <FaMoon />}
    </button>
  );
}

export default DarkModeToggle;
