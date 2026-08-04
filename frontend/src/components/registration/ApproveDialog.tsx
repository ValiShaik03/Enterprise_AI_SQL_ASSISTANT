import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApproveDialogProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onApprove: (role: string) => void;
}

export function ApproveDialog({
  open,
  loading,
  onClose,
  onApprove,
}: ApproveDialogProps) {

  const [role, setRole] = useState("Viewer");

  useEffect(() => {
    if (open) {
      setRole("Viewer");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>

      <DialogContent className="sm:max-w-md">

        <DialogHeader>

          <DialogTitle>
            Approve Registration
          </DialogTitle>

          <DialogDescription>
            Select the role to assign to this user.
          </DialogDescription>

        </DialogHeader>

        <div className="space-y-2">

          <label className="text-sm font-medium">
            Role
          </label>

          <Select
            value={role}
            onValueChange={setRole}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>

              <SelectItem value="Viewer">
                Viewer
              </SelectItem>

              <SelectItem value="Analyst">
                Analyst
              </SelectItem>

              <SelectItem value="Manager">
                Manager
              </SelectItem>

            </SelectContent>

          </Select>

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            onClick={() => onApprove(role)}
            disabled={loading}
          >
            Approve User
          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>
  );
}