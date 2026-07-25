import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="max-w-xl mx-auto py-12">
      <h1 className="text-3xl font-bold">
        Create Account
      </h1>

      <p className="text-muted-foreground mt-2">
        Submit your registration request for administrator approval.
      </p>
    </div>
  );
}