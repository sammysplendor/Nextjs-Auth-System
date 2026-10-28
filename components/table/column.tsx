"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { type DataTableFeatures } from "@/utils/data-table-features";
import useUser, { UserProps } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState } from "react";

// Helper component for the action buttons inside each row
const ActionCell = ({ user }: { user: UserProps }) => {
  const { setUser, setIsOpen } = useUser();
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEdit = () => {
    setUser(user);
    setIsOpen(true);
  };

  const handleDelete = async () => {
    try {
      await authClient.admin.removeUser({
        userId: user.id,
      });

      toast.success("User deleted successfully!");
      router.refresh();
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete user");
      console.error("DELETE USER ERROR:", error);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={handleEdit}
        >
          Edit
        </Button>
        {user.hasDeletePermission && (
          <Button
            variant="destructive"
            size="sm"
            className="cursor-pointer"
            onClick={() => setIsDeleteModalOpen(true)}
            title="Delete user"
          >
            <Trash />
          </Button>
        )}
      </div>

      <Dialog
        open={isDeleteModalOpen}
        onOpenChange={(isOpen) => {
          setIsDeleteModalOpen(isOpen);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete {user.name}? <br />
            This action cannot be undone.
          </DialogDescription>

          <DialogFooter>
            <Button
              variant="destructive"
              className="w-full cursor-pointer"
              onClick={handleDelete}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, UserProps>();

export const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "Name",
  }),
  columnHelper.accessor("email", {
    header: "Email",
  }),
  columnHelper.accessor("role", {
    header: "Role",
  }),
  columnHelper.accessor("emailVerify", {
    header: "Email verified",
  }),
  columnHelper.display({
    id: "action",
    header: "Acton",
    cell: ({ row }) => <ActionCell user={row.original} />,
  }),
]);
export type { UserProps };
