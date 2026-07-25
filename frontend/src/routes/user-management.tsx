import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { usersApi } from "@/api/users";
import UserTable from "@/components/users/UserTable";

export const Route = createFileRoute("/user-management")({
  component: UserManagementPage,
});

function UserManagementPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: usersApi.getUsers,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          User Management
        </h1>

        <p className="text-muted-foreground">
          Manage users and permissions.
        </p>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <UserTable users={data} />
      )}
    </div>
  );
}