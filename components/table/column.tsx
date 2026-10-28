"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { type DataTableFeatures } from "@/utils/data-table-features";
import useUser, { UserProps } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";

// Helper component for the action buttons inside each row
const ActionCell = ({ user }: { user: UserProps }) => {
  const { setUser, setIsOpen } = useUser();
  const router = useRouter();

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
    } catch (error) {
      toast.error("Failed to delete user");
      console.error("DELETE USER ERROR:", error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        onClick={handleEdit}
      >
        Edit
      </Button>
      <Button
        variant="destructive"
        size="sm"
        className="cursor-pointer"
        onClick={handleDelete}
        title="Delete user"
      >
        <Trash />
      </Button>
    </div>
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
