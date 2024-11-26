import { StrictMode, Suspense, lazy } from "react";
import { createRoot, type Root } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { SWRConfig } from "swr";
import { fetcher } from "./lib/fetcher";
import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { ErrorPage } from "@/pages/ErrorPage";
// import RegisterPage from "@/pages/RegisterPage"; // Import the RegisterPage component
import RegisterPage from "@/pages/RegisterPage"; // Import the RegisterPage component

// Development logging utility
const logDev = (...args: unknown[]): void => {
  if (process.env.NODE_ENV === "development") {
    console.log("[iForge]", ...args);
  }
};

// Enhanced error handling for module loading
const lazyLoadPage = (importFn: () => Promise<any>, pageName: string) =>
  lazy(async () => {
    try {
      const module = await importFn();
      return { default: module.default || module[pageName] };
    } catch (error) {
      logDev(`Failed to load ${pageName}:`, error);
      return {
        default: () => (
          <ErrorPage
            message={`Failed to load ${pageName}. Please try again.`}
          />
        ),
      };
    }
  });

// Lazy loaded pages with consistent exports
export const HomePage = lazyLoadPage(
  () => import("@/pages/HomePage"),
  "HomePage",
);
export const ModelPage = lazyLoadPage(
  () => import("@/pages/ModelPage"),
  "ModelPage",
);
export const SearchPage = lazyLoadPage(
  () => import("@/pages/SearchPage"),
  "SearchPage",
);
export const CategoriesPage = lazyLoadPage(
  () => import("@/pages/CategoriesPage"),
  "CategoriesPage",
);
export const ProfilePage = lazyLoadPage(
  () => import("@/pages/ProfilePage"),
  "ProfilePage",
);
export const CreatePage = lazyLoadPage(
  () => import("@/pages/CreatePage"),
  "CreatePage",
);
export const LoginPage = lazyLoadPage(
  () => import("@/pages/LoginPage"),
  "LoginPage",
);
export const AdminPage = lazyLoadPage(
  () => import("@/pages/AdminPage"),
  "AdminPage",
);

// Loading component with proper error boundary
export const PageLoader = () => (
  <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
  </div>
);

// Enhanced error fallback with development details
export function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-destructive">
          Something went wrong
        </h2>
        <p className="text-muted-foreground">{error.message}</p>
        {process.env.NODE_ENV === "development" && (
          <pre className="mt-2 text-sm text-muted-foreground overflow-auto max-w-md">
            {error.stack}
          </pre>
        )}
        <Button onClick={resetErrorBoundary}>Try Again</Button>
      </div>
    </div>
  );
}

// Enhanced SWR configuration
const swrConfig = {
  fetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  shouldRetryOnError: (err: unknown) => {
    if (err && typeof err === "object" && "status" in err) {
      const status = (err as { status: number }).status;
      if (status === 401 || status >= 500) return false;
    }
    return true;
  },
  onError: (error: unknown) => {
    if (error && typeof error === "object" && "status" in error) {
      const status = (error as { status: number }).status;
      if (status !== 401) {
        console.error("[iForge] API Error:", error);
      }
    }
  },
  dedupingInterval: 5000,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
};

export function App() {
  return (
    <StrictMode>
      <ErrorBoundary>
        <SWRConfig value={swrConfig}>
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Switch>
                <Route path="/" component={HomePage} />
                <Route path="/model/:id" component={ModelPage} />
                <Route path="/search" component={SearchPage} />
                <Route path="/categories" component={CategoriesPage} />
                <Route path="/profile" component={ProfilePage} />
                <Route path="/Createpage" component={CreatePage} />;
                <Route path="/login" component={LoginPage} />
                <Route path="/RegisterPage" component={RegisterPage} />
                {/* Added route for RegisterPage */}
                <Route path="/admin" component={AdminPage} />
                <Route>{() => <ErrorPage message="Page not found" />}</Route>
              </Switch>
            </Suspense>
          </Layout>
          <Toaster />
        </SWRConfig>
      </ErrorBoundary>
    </StrictMode>
  );
}

// Single root instance management
let root: Root | null = null;
const rootElement = document.getElementById("root");

// Check if the root element exists
if (!rootElement) {
  throw new Error("Root element not found");
}

// Enhanced root creation with proper cleanup
function createOrUpdateRoot() {
  try {
    if (!root) {
      logDev("Creating new root instance");
      root = createRoot(rootElement!); // You don't need the ! here anymore, as rootElement is guaranteed to be a valid DOM element.
    }
    root.render(<App />);
  } catch (error) {
    console.error("[iForge] Root creation/render error:", error);
    if (root) {
      try {
        root.unmount();
      } catch (unmountError) {
        console.error("[iForge] Unmount error:", unmountError);
      }
      root = null;
    }
    createOrUpdateRoot();
  }
}

// Development HMR handling
declare global {
  interface ImportMeta {
    hot?: {
      accept: (callback: () => void) => void;
      dispose: (callback: () => void) => void;
    };
  }
}

if (process.env.NODE_ENV === "development" && import.meta.hot) {
  import.meta.hot.dispose(() => {
    logDev("Cleaning up before HMR update");
    if (root) {
      try {
        root.unmount();
        root = null;
      } catch (error) {
        console.error("[iForge] HMR cleanup error:", error);
      }
    }
  });

  import.meta.hot.accept(() => {
    logDev("HMR update received");
    try {
      createOrUpdateRoot();
    } catch (error) {
      console.error("[iForge] HMR update failed:", error);
      window.location.reload();
    }
  });
}

// Initial render
createOrUpdateRoot();
