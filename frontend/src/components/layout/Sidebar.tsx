import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Sparkles,
  BarChart3,
  Users,
  FileCode2,
  Settings,
  Database,
  ShieldCheck,
  History,
  UserCircle,
  UsersRound,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

type Item = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles?: string[];
};

const items: Item[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/assistant", label: "AI SQL", icon: Sparkles },

  {
    to: "/database",
    label: "Database",
    icon: Database,
    roles: ["admin", "manager", "analyst"],
  },

  { to: "/analytics", label: "Analytics", icon: BarChart3 },

  {
    to: "/employees",
    label: "Employees",
    icon: Users,
    roles: ["admin", "manager", "analyst"],
  },

  { to: "/history", label: "Query History", icon: History },

  {
    to: "/users",
    label: "User Management",
    icon: UsersRound,
    roles: ["admin", "administrator"],
  },

  {
  to: "/registration-requests",
  label: "Registration Requests",
  icon: UserPlus,
  roles: ["admin", "administrator"],
},

  {
    to: "/audit",
    label: "Audit Logs",
    icon: ShieldCheck,
    roles: ["admin", "administrator"],
  },

  { to: "/docs", label: "API Docs", icon: FileCode2 },
  { to: "/profile", label: "Profile", icon: UserCircle },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { hasRole, role } = useAuth();
  const isViewer = role?.toLowerCase() === "viewer";
  const visible = items.filter((i) => !i.roles || hasRole(i.roles));

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 h-screen sticky top-0 p-4 gap-1 border-r border-border overflow-y-auto">
      <Link to="/" className="flex items-center gap-2 px-2 py-3 mb-2">
        <div className="h-9 w-9 rounded-xl gradient-brand grid place-items-center shadow-lg shadow-primary/30">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold leading-tight">SQL RAG</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
            AI Assistant
          </div>
        </div>
      </Link>
      {visible.map((item) => {
        const Icon = item.icon;
        const active =
          item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all",
              active
                ? "gradient-brand text-white shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}
