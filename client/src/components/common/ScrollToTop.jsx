import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageview } from "../../lib/monitoring";

/**
 * Scrolls the window to the top whenever the route changes. Without this,
 * React Router preserves scroll position between page navigations, so
 * clicking a link while scrolled down lands you on the new page still
 * scrolled down. Also records each route change as a pageview (a no-op
 * unless analytics is configured) - this is the one place every navigation
 * already passes through.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageview();
  }, [pathname]);

  return null;
}

export default ScrollToTop;
