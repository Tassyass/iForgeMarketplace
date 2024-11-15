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
import { ErrorPage } from "@/pages/ErrorPage";

// Lazy load pages with error boundaries
const HomePage = lazy(() => 
  import("@/pages/HomePage").then(module => ({
    default: module.HomePage || module.default
  }))
);

const ModelPage = lazy(() => 
  import("@/pages/ModelPage").then(module => ({
    default: module.ModelPage || module.default
  }))
);

const SearchPage = lazy(() => 
  import("@/pages/SearchPage").then(module => ({
    default: module.SearchPage || module.default
  }))
);

const CategoriesPage = lazy(() => 
  import("@/pages/CategoriesPage").then(module => ({
    default: module.CategoriesPage || module.default
  }))
);

const ProfilePage = lazy(() => 
  import("@/pages/ProfilePage").then(module => ({
    default: module.ProfilePage || module.default
  }))
);

const CreatePage = lazy(() => 
  import("@/pages/CreatePage").then(module => ({
    default: module.CreatePage || module.default
  }))
);

const LoginPage = lazy(() => 
  import("@/pages/LoginPage").then(module => ({
    default: module.LoginPage || module.default
  }))
);

// Optimized loading fallback
const PageLoader = () => (
  <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
  </div>
);

// Error fallback component with retry functionality
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-destructive">Something went wrong</h2>
        <p className="text-muted-foreground">{error.message}</p>
        <Button onClick={resetErrorBoundary}>Try Again</Button>
      </div>
    </div>
  );
}

// Enhanced SWR configuration
const swrConfig = {
  fetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: (err: any) => {
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

function App() {
  return (
    <StrictMode>
      <ErrorBoundary fallbackRender={ErrorFallback}>
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
}

// Create root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(<App />);
