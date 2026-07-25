import { User } from "@/types/user";

type Props = {
  users: User[];
};

export default function UserTable({ users }: Props) {
  return (
    <div className="rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Role</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Created</th>
            <th className="text-right p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                className="border-t"
              >
                <td className="p-3">{user.full_name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">{user.status}</td>
                <td className="p-3">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>

                <td className="p-3 text-right">
                  Edit | Delete
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}