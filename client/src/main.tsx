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

// Development logging utility
const logDev = (...args: any[]) => {
  if (import.meta.env.DEV) {
    console.log('[iForge]', ...args);
  }
};

// Lazy load pages with error boundaries and proper error handling
const lazyLoadPage = (importFn: () => Promise<any>, pageName: string) =>
  lazy(() =>
    importFn()
      .then(module => ({
        default: module.default || module[pageName]
      }))
      .catch(error => {
        logDev(`Failed to load ${pageName}:`, error);
        return {
          default: () => (
            <ErrorPage message={`Failed to load ${pageName}. Please try again.`} />
          )
        };
      })
  );

// Lazy loaded pages
const HomePage = lazyLoadPage(() => import("@/pages/HomePage"), "HomePage");
const ModelPage = lazyLoadPage(() => import("@/pages/ModelPage"), "ModelPage");
const SearchPage = lazyLoadPage(() => import("@/pages/SearchPage"), "SearchPage");
const CategoriesPage = lazyLoadPage(() => import("@/pages/CategoriesPage"), "CategoriesPage");
const ProfilePage = lazyLoadPage(() => import("@/pages/ProfilePage"), "ProfilePage");
const CreatePage = lazyLoadPage(() => import("@/pages/CreatePage"), "CreatePage");
const LoginPage = lazyLoadPage(() => import("@/pages/LoginPage"), "LoginPage");

// Optimized loading fallback with proper error states
const PageLoader = () => (
  <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
  </div>
);

// Enhanced error fallback with detailed reporting
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-destructive">Something went wrong</h2>
        <p className="text-muted-foreground">{error.message}</p>
        {import.meta.env.DEV && (
          <pre className="mt-2 text-sm text-muted-foreground overflow-auto max-w-md">
            {error.stack}
          </pre>
        )}
        <Button onClick={resetErrorBoundary}>Try Again</Button>
      </div>
    </div>
  );
}

// Enhanced SWR configuration with better error handling and reconnection strategy
const swrConfig = {
  fetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  shouldRetryOnError: (err: any) => {
    if (err.status === 401 || err.status >= 500) {
      logDev('Not retrying due to error status:', err.status);
      return false;
    }
    return true;
  },
  onError: (error: any) => {
    if (error.status !== 401) {
      console.error('[iForge] API Error:', error.message || 'An unexpected error occurred');
    }
  },
  dedupingInterval: 5000,
  errorRetryCount: 3,
  errorRetryInterval: (retryCount: number) => Math.min(1000 * (2 ** retryCount), 30000),
  onErrorRetry: (error: any, key: string, config: any, revalidate: any, { retryCount }: { retryCount: number }) => {
    if (error.status === 401 || error.status >= 500) return;
    if (retryCount >= 3) return;
    
    setTimeout(() => {
      logDev(`Retrying request for ${key}, attempt ${retryCount + 1}`);
      revalidate({ retryCount });
    }, Math.min(1000 * (2 ** retryCount), 30000));
  },
};

function App() {
  return (
    <StrictMode>
      <ErrorBoundary 
        onError={(error: Error) => {
          logDev('ErrorBoundary caught error:', error);
        }}
        onReset={() => {
          logDev('ErrorBoundary reset');
        }}
      >
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
                <Route>
                  {() => <ErrorPage message="Page not found" />}
                </Route>
              </Switch>
            </Suspense>
          </Layout>
          <Toaster />
        </SWRConfig>
      </ErrorBoundary>
    </StrictMode>
  );
}

// Root creation with proper cleanup and HMR handling
let root: ReturnType<typeof createRoot> | null = null;
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

function render() {
  if (!root) {
    logDev('Creating root and performing initial render');
    root = createRoot(rootElement);
  }
  
  try {
    root.render(<App />);
  } catch (error) {
    console.error('[iForge] Render error:', error);
    // Attempt recovery by recreating root
    if (root) {
      root.unmount();
      root = null;
    }
    render();
  }
}

// HMR handling
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    logDev('HMR update received');
    try {
      render();
    } catch (error) {
      console.error('[iForge] HMR update failed:', error);
      // Force reload on critical HMR failure
      window.location.reload();
    }
  });

  // Cleanup on HMR dispose
  import.meta.hot.dispose(() => {
    logDev('Cleaning up before HMR update');
    if (root) {
      root.unmount();
      root = null;
    }
  });
}

render();
