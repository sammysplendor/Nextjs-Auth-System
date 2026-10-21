import { Toaster } from "sonner";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-dvh flex items-center justify-center py-6 mt-4 overflow-y-auto">
      {children}
      <Toaster position="bottom-right" richColors />
    </div>
  );
};

export default AuthLayout;
