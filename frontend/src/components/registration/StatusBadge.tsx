import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "Pending":
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-500 text-white">
          Pending
        </Badge>
      );

    case "Approved":
      return (
        <Badge className="bg-green-600 hover:bg-green-600 text-white">
          Approved
        </Badge>
      );

    case "Rejected":
      return (
        <Badge className="bg-red-600 hover:bg-red-600 text-white">
          Rejected
        </Badge>
      );

    default:
      return <Badge>{status}</Badge>;
  }
}