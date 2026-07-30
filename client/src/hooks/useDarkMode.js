import { useEffect, useRef, useState } from "react";
import { getTimes } from "suncalc";

const STORAGE_KEY = "chadi_theme";
// How often to re-check sun position while a tab stays open across sunset/
// sunrise - 10 minutes is frequent enough that the switch feels prompt
// without polling pointlessly often.
const RECHECK_INTERVAL_MS = 10 * 60 * 1000;
const GEO_OPTIONS = { maximumAge: 60 * 60 * 1000, timeout: 10 * 1000 };

function prefersDarkOS() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function isNightAt(lat, lng, now = new Date()) {
  const { sunrise, sunset } = getTimes(now, lat, lng);
  return now < sunrise || now > sunset;
}

function getInitialTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  // No explicit choice saved yet - default to the visitor's OS preference
  // as an immediate best guess; the effect below upgrades this to real
  // sunset/sunrise as soon as geolocation resolves (asynchronous, so it
  // can't be known synchronously at first render).
  return prefersDarkOS() ? "dark" : "light";
}

/**
 * Site-wide dark mode with three layers of precedence:
 *   1. An explicit choice via `toggle()` - persisted, always wins, no more
 *      auto-switching after this.
 *   2. Sunset/sunrise at the visitor's actual location, via the Geolocation
 *      API + SunCalc - re-checked every RECHECK_INTERVAL_MS so the theme
 *      flips live if the tab is left open across sunset or sunrise.
 *   3. The OS's light/dark preference - used until geolocation resolves,
 *      and permanently if it's denied or unavailable.
 * Applies a `dark` class to <html>, which every `dark:` Tailwind utility
 * (and the theme token overrides in index.css) key off - see the
 * @custom-variant declaration there.
 */
export function useDarkMode() {
  const [theme, setTheme] = useState(getInitialTheme);
  // Tracks whether geolocation is actively driving the theme, so the OS
  // media-query listener (layer 3) knows to stand down once layer 2 takes
  // over, instead of the two fighting over every change.
  const geoActiveRef = useRef(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return undefined;

    let cancelled = false;
    let intervalId;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const followOS = (event) => {
      if (geoActiveRef.current || localStorage.getItem(STORAGE_KEY)) return;
      setTheme((event ? event.matches : media.matches) ? "dark" : "light");
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (cancelled) return;
          geoActiveRef.current = true;
          const { latitude, longitude } = position.coords;

          const applySunTheme = () => {
            if (localStorage.getItem(STORAGE_KEY)) return;
            setTheme(isNightAt(latitude, longitude) ? "dark" : "light");
          };

          applySunTheme();
          intervalId = setInterval(applySunTheme, RECHECK_INTERVAL_MS);
        },
        () => {
          // Permission denied, or geolocation failed - stay on the OS
          // preference instead (followOS below already covers this).
        },
        GEO_OPTIONS
      );
    }

    // Layer 3 - active immediately if geolocation isn't available at all,
    // and stays wired up as a fallback even while geolocation is pending
    // (followOS itself checks geoActiveRef, so it goes quiet once layer 2
    // kicks in rather than needing to be torn down here).
    media.addEventListener("change", followOS);

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      media.removeEventListener("change", followOS);
    };
  }, []);

  const toggle = () => {
    geoActiveRef.current = false;
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  return { theme, isDark: theme === "dark", toggle };
}
