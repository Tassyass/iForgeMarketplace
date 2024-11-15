import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { SWRConfig } from "swr";
import { fetcher } from "./lib/fetcher";
import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Lazy load pages with proper default exports
const HomePage = lazy(() => import("@/pages/HomePage").then(module => ({ default: module.default })));
const ModelPage = lazy(() => import("@/pages/ModelPage").then(module => ({ default: module.default })));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

// Prevent multiple root creation
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

let root: ReturnType<typeof createRoot>;
try {
  // Try to get existing root
  root = (rootElement as any)._reactRootContainer._internalRoot;
} catch {
  // Create new root if none exists
  root = createRoot(rootElement);
}

// Render app
function render() {
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <SWRConfig 
          value={{ 
            fetcher,
            revalidateOnFocus: false,
            shouldRetryOnError: false
          }}
        >
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Switch>
                <Route path="/" component={HomePage} />
                <Route path="/model/:id" component={ModelPage} />
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
render();

// HMR support with proper type checking
declare global {
  interface ImportMeta {
    hot?: {
      accept: () => void;
    };
    env: {
      DEV: boolean;
      [key: string]: any;
    };
  }
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
