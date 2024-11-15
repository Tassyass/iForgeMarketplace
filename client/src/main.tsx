import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { SWRConfig } from "swr";
import { fetcher } from "./lib/fetcher";
import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import ErrorPage from "@/pages/ErrorPage";

// Lazy load pages with error boundaries
const HomePage = lazy(() => 
  import("@/pages/HomePage").catch(() => ({
    default: () => <ErrorPage message="Failed to load Home page" />
  }))
);
const ModelPage = lazy(() => 
  import("@/pages/ModelPage").catch(() => ({
    default: () => <ErrorPage message="Failed to load Model page" />
  }))
);
const SearchPage = lazy(() => 
  import("@/pages/SearchPage").catch(() => ({
    default: () => <ErrorPage message="Failed to load Search page" />
  }))
);
const CategoriesPage = lazy(() => 
  import("@/pages/CategoriesPage").catch(() => ({
    default: () => <ErrorPage message="Failed to load Categories page" />
  }))
);
const ProfilePage = lazy(() => 
  import("@/pages/ProfilePage").catch(() => ({
    default: () => <ErrorPage message="Failed to load Profile page" />
  }))
);
const CreatePage = lazy(() => 
  import("@/pages/CreatePage").catch(() => ({
    default: () => <ErrorPage message="Failed to load Create page" />
  }))
);
const LoginPage = lazy(() => 
  import("@/pages/LoginPage").catch(() => ({
    default: () => <ErrorPage message="Failed to load Login page" />
  }))
);

// Optimized loading fallback
const PageLoader = () => (
  <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
  </div>
);

// Error fallback component with retry functionality
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold text-destructive">Something went wrong</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={resetErrorBoundary}>Try Again</Button>
    </div>
  </div>
);

// Enhanced SWR configuration
const swrConfig = {
  fetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: (err: any) => {
    // Don't retry on auth errors or server errors
    if (err.status === 401 || err.status >= 500) return false;
    return true;
  },
  onError: (error: any) => {
    if (error.status !== 401) {
      console.error('API Error:', error.message || 'An unexpected error occurred');
    }
  },
  dedupingInterval: 5000,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
};

const App = () => (
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SWRConfig value={swrConfig}>
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/model/:id" component={ModelPage} />
              <Route path="/search" component={SearchPage} />
              <Route path="/categories" component={CategoriesPage} />
              <Route path="/profile" component={ProfilePage} />
              <Route path="/create" component={CreatePage} />
              <Route path="/login" component={LoginPage} />
              <Route component={ErrorPage} />
            </Switch>
          </Suspense>
        </Layout>
        <Toaster />
      </SWRConfig>
    </ErrorBoundary>
  </StrictMode>
);

// Create root only once and store it in a variable outside of HMR scope
let root: ReturnType<typeof createRoot> | null = null;
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

if (!root) {
  root = createRoot(rootElement);
  root.render(<App />);
}

// Safe HMR handling
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    if (root) {
      root.render(<App />);
    }
  });
}
