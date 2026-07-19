import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/common/ScrollToTop";
import ChunkErrorBoundary from "./components/common/ChunkErrorBoundary";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <ChunkErrorBoundary>
        <AppRoutes />
      </ChunkErrorBoundary>
    </AuthProvider>
  );
}

export default App;
