import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui-kit/Card";
import { StatusBadge } from "./StatusBadge";
import type { RegistrationRequest } from "@/types/registration";

interface RegistrationTableProps {
  requests: RegistrationRequest[];
  approving: boolean;
  rejecting: boolean;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

export function RegistrationTable({
  requests,
  approving,
  rejecting,
  onApprove,
  onReject,
}: RegistrationTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="text-left px-6 py-4">Name</th>
              <th className="text-left px-6 py-4">Email</th>
              <th className="text-left px-6 py-4">Role</th>
              <th className="text-left px-6 py-4">Status</th>
              <th className="text-left px-6 py-4">Created</th>
              <th className="text-center px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  No registration requests found.
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr
                  key={request.request_id}
                  className="border-b hover:bg-muted/30"
                >
                  <td className="px-6 py-4 font-medium">
                    {request.full_name}
                  </td>

                  <td className="px-6 py-4">
                    {request.email}
                  </td>

                  <td className="px-6 py-4">
                    {request.requested_role}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={request.status} />
                  </td>

                  <td className="px-6 py-4">
                    {new Date(request.created_at).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    {request.status === "Pending" ? (
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          onClick={() =>
                            onApprove(request.request_id)
                          }
                          disabled={approving}
                        >
                          Approve
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            onReject(request.request_id)
                          }
                          disabled={rejecting}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground text-sm">
                        Processed
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}