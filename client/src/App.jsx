import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/common/ScrollToTop";
import ChunkErrorBoundary from "./components/common/ChunkErrorBoundary";
import CookieConsent from "./components/common/CookieConsent";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <ChunkErrorBoundary>
        <AppRoutes />
      </ChunkErrorBoundary>
      <CookieConsent />
    </AuthProvider>
  );
}

export default App;
