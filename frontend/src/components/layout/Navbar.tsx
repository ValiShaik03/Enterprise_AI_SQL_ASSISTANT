import { useEffect, useRef, useState } from "react";
import { Moon, Sun, Menu, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { services } from "@/api/services";
import { getTheme, setTheme, applyTheme } from "@/lib/config";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Sparkles,
  BarChart3,
  Users,
  FileCode2,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clearAuth, getUser, userDisplayName, userInitials } from "@/lib/auth";
import { useToast } from "@/components/ui-kit/Toast";
import { NotificationBell } from "./NotificationBell";

const mobileItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/assistant", label: "AI SQL", icon: Sparkles },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/employees", label: "Employees", icon: Users },
  { to: "/docs", label: "API Docs", icon: FileCode2 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Navbar() {
  const [theme, setThemeState] = useState<"dark" | "light">("dark");
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const toast = useToast();
  const menuRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState(() => getUser());

  useEffect(() => {
    const t = getTheme();
    setThemeState(t);
    applyTheme(t);
    setUser(getUser());
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const { data, isError } = useQuery({
    queryKey: ["health-ping"],
    queryFn: services.health,
    refetchInterval: 30_000,
    retry: 0,
  });

  const healthy = !!data && !isError;

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setThemeState(next);
    setTheme(next);
  };

  const handleLogout = () => {
    clearAuth();
    toast({ type: "success", message: "Signed out." });
    navigate({ to: "/login" });
  };

  const name = userDisplayName(user);
  const initials = userInitials(user);
  const role = (user?.role as string) || "User";

  return (
    <>
      <header className="sticky top-0 z-30 glass border-b border-border">
        <div className="flex items-center gap-3 px-4 lg:px-6 h-14">
          <button
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-muted"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 lg:hidden">
            <div className="h-7 w-7 rounded-lg gradient-brand grid place-items-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold">SQL RAG</span>
          </div>
          <div className="flex-1" />
          <div
            className={cn(
              "hidden sm:flex items-center gap-2 rounded-full px-3 py-1 text-xs border",
              healthy
                ? "border-[color:var(--success)]/40 text-[color:var(--success)] bg-[color:var(--success)]/10"
                : "border-destructive/40 text-destructive bg-destructive/10",
            )}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                healthy ? "bg-[color:var(--success)]" : "bg-destructive",
                healthy && "animate-pulse",
              )}
            />
            {healthy ? "Backend Online" : "Backend Offline"}
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          <NotificationBell />

          {/* Profile menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 p-1 pl-1 pr-2 rounded-full hover:bg-muted transition"
            >
              <div className="h-8 w-8 rounded-full gradient-brand grid place-items-center text-xs font-semibold text-white">
                {initials}
              </div>
              <div className="hidden md:flex flex-col items-start leading-tight">
                <span className="text-xs font-medium">{name}</span>
                <span className="text-[10px] text-muted-foreground capitalize">
                  {role}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl glass border border-border shadow-2xl overflow-hidden z-50">
                <div className="p-3 border-b border-border flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full gradient-brand grid place-items-center text-sm font-semibold text-white">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {user?.email || "—"}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-primary mt-0.5">
                      {role}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate({ to: "/settings" });
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted text-left"
                >
                  <UserIcon className="h-4 w-4" /> Profile & Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted text-left text-destructive"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur" onClick={() => setOpen(false)}>
          <nav
            className="glass border-r border-border h-full w-64 p-4 flex flex-col gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {mobileItems.map((item) => {
              const Icon = item.icon;
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm",
                    active
                      ? "gradient-brand text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
