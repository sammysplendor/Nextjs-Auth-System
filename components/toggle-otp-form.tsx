import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

const toggleOTPSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

interface ToggleOTPProps {
  twoFactorEnabled: boolean;
}

type ToggleOTPSchema = z.infer<typeof toggleOTPSchema>;

const ToggleOTPForm = ({ twoFactorEnabled }: ToggleOTPProps) => {
  const toggleOtpForm = useForm<ToggleOTPSchema>({
    resolver: zodResolver(toggleOTPSchema),
    defaultValues: {
      password: "",
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleChange = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <Label>Enable/Disable Two-Factor Authentication</Label>
        <Switch checked={twoFactorEnabled} onCheckedChange={handleChange} />
      </div>

      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {!twoFactorEnabled
                ? "Enable Two-Factor Authentication"
                : "Disable Two-Factor Authentication"}
            </DialogTitle>
            <DialogDescription>
              Please confirm your password to{" "}
              {!twoFactorEnabled ? "enable" : "disable"} 2FA in your account.
            </DialogDescription>
          </DialogHeader>

          <form></form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ToggleOTPForm;
