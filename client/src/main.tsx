import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { SWRConfig } from "swr";
import { fetcher } from "./lib/fetcher";
import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/toaster";

// Lazy load pages
const HomePage = lazy(() => import("@/pages/HomePage").then(mod => ({ default: mod.HomePage })));
const ModelPage = lazy(() => import("@/pages/ModelPage").then(mod => ({ default: mod.ModelPage })));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SWRConfig value={{ fetcher }}>
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
  </StrictMode>
);
