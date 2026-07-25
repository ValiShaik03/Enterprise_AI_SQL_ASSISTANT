import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui-kit/Card";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="max-w-xl mx-auto py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold gradient-text">
          Create Account
        </h1>

        <p className="text-muted-foreground mt-2">
          Submit your registration request for administrator approval.
        </p>
      </div>

      <Card className="p-6">
        <RegisterForm />
      </Card>
    </div>
  );
}