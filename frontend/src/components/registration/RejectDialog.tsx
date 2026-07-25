import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface RejectDialogProps {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
}

export function RejectDialog({
  open,
  loading = false,
  onClose,
  onReject,
}: RejectDialogProps) {
  const [reason, setReason] = useState("");

  const handleReject = () => {
    if (!reason.trim()) return;

    onReject(reason);

    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Reject Registration</DialogTitle>

          <DialogDescription>
            Please provide a reason for rejecting this registration request.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>Reason</Label>

          <Textarea
            rows={5}
            placeholder="Enter rejection reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setReason("");
              onClose();
            }}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            disabled={!reason.trim() || loading}
            onClick={handleReject}
          >
            {loading ? "Rejecting..." : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}