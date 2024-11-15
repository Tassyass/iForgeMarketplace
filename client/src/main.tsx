import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { SWRConfig } from "swr";
import { fetcher } from "./lib/fetcher";
import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Lazy load pages
const HomePage = lazy(() => import("@/pages/HomePage"));
const ModelPage = lazy(() => import("@/pages/ModelPage"));
const SearchPage = lazy(() => import("@/pages/SearchPage"));
const CategoriesPage = lazy(() => import("@/pages/CategoriesPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

// Root element
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

// Create root only if it doesn't exist
if (!(rootElement as any)._reactRootContainer) {
  const root = createRoot(rootElement);
  
  function App() {
    return (
      <StrictMode>
        <ErrorBoundary>
          <SWRConfig 
            value={{ 
              fetcher,
              revalidateOnFocus: false,
              shouldRetryOnError: false,
              suspense: true // Enable suspense mode for better loading states
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
                  <Route>
                    <div className="container py-16 text-center">
                      <h1 className="text-4xl font-bold mb-4">404 Page Not Found</h1>
                      <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
                    </div>
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

  // Initial render
  root.render(<App />);
}

// HMR support
if (import.meta.hot) {
  import.meta.hot.accept();
}