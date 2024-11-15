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

const App = () => {
  return (
    <StrictMode>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <SWRConfig 
          value={{ 
            fetcher,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            shouldRetryOnError: (err: any) => {
              if (err.status === 401) return false;
              return true;
            },
            onError: (error: any) => {
              if (error.status !== 401) {
                console.error('SWR Error:', error);
              }
            }
          }}
        >
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Switch>
                <Route path="/" component={HomePage} />
                <Route path="/model/:id" component={ModelPage} />
                <Route path="/search" component={SearchPage} />
                <Route path="/categories" component={CategoriesPage} />
                <Route path="/profile" component={ProfilePage} />
                <Route path="/create" component={CreatePage} />
                <Route component={ErrorPage} />
              </Switch>
            </Suspense>
          </Layout>
          <Toaster />
        </SWRConfig>
      </ErrorBoundary>
    </StrictMode>
  );
};

// Create root only once
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);
root.render(<App />);

// Enable HMR with type safety
if (import.meta.hot) {
  import.meta.hot.accept();
}
