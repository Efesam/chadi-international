import { MotionConfig } from "motion/react";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/common/ScrollToTop";
import ChunkErrorBoundary from "./components/common/ChunkErrorBoundary";
import CookieConsent from "./components/common/CookieConsent";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    // reducedMotion="user" makes every motion/react animation site-wide
    // (Hero, Reveal, StaggerGrid, etc.) respect the OS-level "reduce motion"
    // accessibility setting automatically - those visitors get the final
    // state instantly instead of the entrance transform, rather than being
    // stuck mid-animation (or at its pre-animation offset) with no way to
    // opt out.
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <ScrollToTop />
        <ChunkErrorBoundary>
          <AppRoutes />
        </ChunkErrorBoundary>
        <CookieConsent />
      </AuthProvider>
    </MotionConfig>
  );
}

export default App;
