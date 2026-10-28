"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center gap-16 h-screen">
      <h1 className="text-4xl">Welcome to the Home page</h1>

      <div className="flex justify-center gap-4">
        <Button
          variant="default"
          className="cursor-pointer w-36"
          onClick={() => router.push("/user-management")}
        >
          Manage Users
        </Button>
        <Button
          variant="ghost"
          className="cursor-pointer w-36"
          onClick={() => router.push("/profile")}
        >
          Visit Profile
        </Button>
      </div>
    </div>
  );
}
