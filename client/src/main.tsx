import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { SWRConfig } from "swr";
import { fetcher } from "./lib/fetcher";
import { Layout } from "@/components/Layout";
import { HomePage } from "@/pages/HomePage";
import { Toaster } from "@/components/ui/toaster";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SWRConfig value={{ fetcher }}>
      <Layout>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route>404 Page Not Found</Route>
        </Switch>
      </Layout>
      <Toaster />
    </SWRConfig>
  </StrictMode>
);
