import { Toaster } from "sonner";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-dvh flex items-center justify-center">
      {children}
      <Toaster position="bottom-right" richColors />
    </div>
  );
};

export default AuthLayout;
