import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";

import { registrationApi } from "@/api/registration";
import { extractApiError } from "@/api/axios";
import { useToast } from "@/components/ui-kit/Toast";
import { Button } from "@/components/ui-kit/Button";

export function RegisterForm() {
  const toast = useToast();

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Viewer");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutation({
    mutationFn: registrationApi.register,

    onSuccess: (data: any) => {
      toast({
        type: "success",
        message:
          data?.message ??
          "Registration request submitted successfully.",
      });

      setFullName("");
      setEmail("");
      setRole("Viewer");
      setPassword("");
      setConfirmPassword("");
    },

    onError: (err) => {
      toast({
        type: "error",
        message: extractApiError(err),
      });
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      return toast({
        type: "error",
        message: "Full name is required.",
      });
    }

    if (!email.trim()) {
      return toast({
        type: "error",
        message: "Email is required.",
      });
    }

    if (!password) {
      return toast({
        type: "error",
        message: "Password is required.",
      });
    }

    if (password !== confirmPassword) {
      return toast({
        type: "error",
        message: "Passwords do not match.",
      });
    }

    mutation.mutate({
      full_name: fullName,
      email,
      password,
      confirm_password: confirmPassword,
      requested_role: role,
    });
  };

  return (
  <form onSubmit={submit} className="flex flex-col gap-4">

    {/* Full Name */}
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-wider text-muted-foreground">
        Full Name
      </label>

      <div className="relative">
        <User className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="John Doe"
          className="w-full h-11 rounded-xl bg-muted/60 border border-border pl-10 pr-3 text-sm outline-none focus:border-primary transition"
          disabled={mutation.isPending}
        />
      </div>
    </div>

    {/* Email */}
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-wider text-muted-foreground">
        Email
      </label>

      <div className="relative">
        <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full h-11 rounded-xl bg-muted/60 border border-border pl-10 pr-3 text-sm outline-none focus:border-primary transition"
          disabled={mutation.isPending}
        />
      </div>
    </div>

    {/* Requested Role */}
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-wider text-muted-foreground">
        Requested Role
      </label>

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="h-11 rounded-xl bg-muted/60 border border-border px-3 text-sm outline-none focus:border-primary"
        disabled={mutation.isPending}
      >
        <option value="Viewer">Viewer</option>
        <option value="Analyst">Analyst</option>
        <option value="Manager">Manager</option>
      </select>
    </div>

    {/* Password */}
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-wider text-muted-foreground">
        Password
      </label>

      <div className="relative">
        <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

        <input
          type={showPwd ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full h-11 rounded-xl bg-muted/60 border border-border pl-10 pr-10 text-sm outline-none focus:border-primary"
          disabled={mutation.isPending}
        />

        <button
          type="button"
          onClick={() => setShowPwd((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {showPwd ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>

    {/* Confirm Password */}
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-wider text-muted-foreground">
        Confirm Password
      </label>

      <div className="relative">
        <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

        <input
          type={showConfirmPwd ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          className="w-full h-11 rounded-xl bg-muted/60 border border-border pl-10 pr-10 text-sm outline-none focus:border-primary"
          disabled={mutation.isPending}
        />

        <button
          type="button"
          onClick={() => setShowConfirmPwd((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {showConfirmPwd ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>

    <Button
      type="submit"
      className="h-11 mt-2"
      disabled={mutation.isPending}
    >
      {mutation.isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        "Submit Registration Request"
      )}
    </Button>

  </form>
);}