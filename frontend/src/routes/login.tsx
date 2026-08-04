import {
  createFileRoute,
  useNavigate,
  useSearch,
  Link,
} from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail, Sparkles } from "lucide-react";
import { services, type LoginResponse } from "@/api/services";
import { extractApiError } from "@/api/axios";
import { setToken, setUser, isAuthenticated } from "@/lib/auth";
import { useToast } from "@/components/ui-kit/Toast";
import { Button } from "@/components/ui-kit/Button";

type LoginSearch = { reason?: string; redirect?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): LoginSearch => ({
    reason: typeof s.reason === "string" ? s.reason : undefined,
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { reason, redirect } = useSearch({ from: "/login" });
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) navigate({ to: redirect ?? "/" });
  }, [navigate, redirect]);

  useEffect(() => {
    if (reason) toast({ type: "error", message: reason });
  }, [reason, toast]);

  const mutation = useMutation({
    mutationFn: () => services.login(email.trim(), password),
    onSuccess: (data: LoginResponse) => {
      const token = data.access_token || data.token;
      const failed =
        data.status &&
        ["failed", "error", "failure"].includes(String(data.status).toLowerCase());
      if (!token || failed) {
        const msg = data.message || "Invalid email or password.";
        setFormError(msg);
        toast({ type: "error", message: msg });
        return;
      }
      setToken(token);
      if (data.user) setUser(data.user);
      toast({ type: "success", message: "Signed in successfully." });
      navigate({ to: redirect ?? "/" });
    },
    onError: (err) => {
      const msg = extractApiError(err, "Login failed");
      setFormError(msg);
      toast({ type: "error", message: msg });
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "Enter a valid email";
    if (!password) next.password = "Password is required";
    setErrors(next);
    if (Object.keys(next).length) return;
    mutation.mutate();
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10 bg-background">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl gradient-brand grid place-items-center shadow-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">SQL RAG Assistant</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your enterprise dashboard
          </p>
        </div>

        <form
          onSubmit={submit}
          className="glass rounded-2xl border border-border p-6 flex flex-col gap-4 shadow-2xl"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              Email
            </label>
            <div className="relative">
              <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 rounded-xl bg-muted/60 border border-border pl-10 pr-3 text-sm outline-none focus:border-primary transition"
                placeholder="you@company.com"
                disabled={mutation.isPending}
              />
            </div>
            {errors.email && (
              <span className="text-xs text-destructive">{errors.email}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 rounded-xl bg-muted/60 border border-border pl-10 pr-10 text-sm outline-none focus:border-primary transition"
                placeholder="Enter your password"
                disabled={mutation.isPending}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-destructive">{errors.password}</span>
            )}
          </div>

          {formError && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-sm px-3 py-2">
              {formError}
            </div>
          )}

          <Button type="submit" className="mt-1 h-11" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            <div className="mt-3 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary font-semibold hover:underline"
              >
                Register here
              </Link>
            </div>

            <p className="text-[11px] text-center text-muted-foreground mt-1">
              Protected area. Your session is authenticated with JWT.
            </p>
        </form>
      </div>
    </div>
  );
}
