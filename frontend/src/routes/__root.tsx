import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { ToastProvider } from "@/components/ui-kit/Toast";
import { applyTheme, getTheme } from "@/lib/config";
import { AuthProvider, useAuth } from "@/lib/auth-context";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SQL RAG — AI SQL Assistant" },
      {
        name: "description",
        content:
          "Premium AI SQL assistant dashboard. Ask natural language questions, get instant SQL, and explore analytics on your data.",
      },
      { property: "og:title", content: "SQL RAG — AI SQL Assistant" },
      {
        property: "og:description",
        content: "Premium AI SQL assistant dashboard. Ask natural language questions, get instant SQL, and explore analytics on your data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "SQL RAG — AI SQL Assistant" },
      { name: "twitter:description", content: "Premium AI SQL assistant dashboard. Ask natural language questions, get instant SQL, and explore analytics on your data." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/5d0cda41-e45f-494d-9b3a-2afaeecdba6c" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/5d0cda41-e45f-494d-9b3a-2afaeecdba6c" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useEffect(() => {
    applyTheme(getTheme());
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <AppLayout />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AppLayout() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const isPublicRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  useEffect(() => {
    if (!isPublicRoute && !isAuthenticated) {
      navigate({
        to: "/login",
        search: {
          redirect: pathname === "/login" ? undefined : pathname,
        },
      });
    }
  }, [isPublicRoute, isAuthenticated, pathname, navigate]);

  // Public pages don't use the dashboard layout
  if (isPublicRoute) {
    return <Outlet />;
  }

  // Avoid flashing protected UI
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}