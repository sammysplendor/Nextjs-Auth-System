"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Navbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
          toast.success("You have signed out.");
        },
      },
    });
  };

  return (
    <nav className="w-full flex items-center justify-end h-16 shadow-lg mx-auto px-20 max-w-txl mb-6 overflow-hidden bg-slate-900 rounded-md">
      <Button onClick={handleLogout} className="cursor-pointer">
        Logout
      </Button>
    </nav>
  );
};

export default Navbar;
