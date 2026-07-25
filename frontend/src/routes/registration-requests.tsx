
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { registrationApi } from "@/api/registration";
import { RegistrationTable } from "@/components/registration/RegistrationTable";
import { RejectDialog } from "@/components/registration/RejectDialog";
import { Card } from "@/components/ui-kit/Card";
import { useToast } from "@/components/ui-kit/Toast";
import { extractApiError } from "@/api/axios";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw } from "lucide-react";
import type { RegistrationRequest } from "@/types/registration";
export const Route = createFileRoute("/registration-requests")({
  component: RegistrationRequestsPage,
});

function RegistrationRequestsPage() {
  const toast  = useToast();
  const queryClient = useQueryClient();
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);

  const {
  data,
  isLoading,
  refetch,
  isFetching,
} = useQuery({
    queryKey: ["registration-requests"],
    queryFn: registrationApi.getRequests,
  });

  const approveMutation = useMutation({
    mutationFn: registrationApi.approveRequest,
    onSuccess: () => {
    queryClient.invalidateQueries({
        queryKey: ["registration-requests"],
    });

    toast({
    type: "success",
    message: "Registration approved successfully.",
});
},
    onError: (error) => {
      toast({
        type: "error",
        message: extractApiError(error),
    });
},
  });

  const rejectMutation = useMutation({
    mutationFn: ({
      id,
      reason,
    }: {
      id: number;
      reason: string;
    }) => registrationApi.rejectRequest(id, reason),

    onSuccess: () => {
    queryClient.invalidateQueries({
        queryKey: ["registration-requests"],
    });

    setRejectOpen(false);
    setSelectedRequest(null);

    toast({
    type: "success",
    message: "Registration rejected successfully.",
});
},
    onError: (error) => {
      toast({
        type: "error",
        message: extractApiError(error),
    });
},
  });

  if (isLoading) {
  return (
    <div className="flex items-center justify-center h-64">
      Loading registration requests...
    </div>
  );
}

  const requests = (data ?? []).filter(
  (request: RegistrationRequest) => {
  const matchesSearch =
    request.full_name.toLowerCase().includes(search.toLowerCase()) ||
    request.email.toLowerCase().includes(search.toLowerCase());

  const matchesStatus =
    statusFilter === "All" ||
    request.status === statusFilter;

  return matchesSearch && matchesStatus;
});

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">

      <div>
        <h1 className="text-3xl font-bold gradient-text">
          Registration Requests
        </h1>

        <p className="text-muted-foreground mt-2">
          Manage pending user registration requests.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 justify-between">

  <div className="relative w-full md:w-80">
    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

    <Input
      placeholder="Search by name or email..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="pl-10"
    />
  </div>

  <div className="flex gap-3">

    <Select
      value={statusFilter}
      onValueChange={setStatusFilter}
    >
      <SelectTrigger className="w-44">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="All">All</SelectItem>
        <SelectItem value="Pending">Pending</SelectItem>
        <SelectItem value="Approved">Approved</SelectItem>
        <SelectItem value="Rejected">Rejected</SelectItem>
      </SelectContent>
    </Select>

    <Button
      variant="outline"
      onClick={() => refetch()}
      disabled={isFetching}
    >
      <RefreshCw
        className={`mr-2 h-4 w-4 ${
          isFetching ? "animate-spin" : ""
        }`}
      />

      Refresh
    </Button>

  </div>

</div>

      <Card className="p-6">
        <RegistrationTable
          requests={requests}
          approving={approveMutation.isPending}
          rejecting={rejectMutation.isPending}
          onApprove={(id) => approveMutation.mutate(id)}
          onReject={(id) => {
            setSelectedRequest(id);
            setRejectOpen(true);
          }}
        />
      </Card>

      <RejectDialog
        open={rejectOpen}
        loading={rejectMutation.isPending}
        onClose={() => {
            setRejectOpen(false);
            setSelectedRequest(null);
            }}
        onReject={(reason) => {
          if (selectedRequest) {
            rejectMutation.mutate({
              id: selectedRequest,
              reason,
            });
          }
        }}
      />
    </div>
  );
}