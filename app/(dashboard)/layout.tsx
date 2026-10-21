import Navbar from "@/components/navbar";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full min-h-dvh min-w-dvw overflow-hidden">
      <Navbar />
      {children}
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
