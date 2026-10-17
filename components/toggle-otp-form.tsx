"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useRouter } from "next/navigation";

const toggleOTPSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

interface ToggleOTPProps {
  twoFactorEnabled: boolean;
}

type ToggleOTPSchema = z.infer<typeof toggleOTPSchema>;

const ToggleOTPForm = ({ twoFactorEnabled }: ToggleOTPProps) => {
  const router = useRouter();

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

  const onSubmit = async (data: ToggleOTPSchema) => {
    try {
      if (!twoFactorEnabled) {
        const { error } = await authClient.twoFactor.enable({
          password: data.password,
          method: "otp",
        });

        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Two factor authentication enabled!");
      } else {
        const { error } = await authClient.twoFactor.disable({
          password: data.password,
        });

        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Two factor authentication disabled!");
      }

      router.refresh();
    } catch (error) {
      console.error("2FA ERROR:", error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <Card className="w-full max-w-sm border-0 shadow-none h-fit overflow-y-auto">
      <CardHeader>
        <CardTitle>Enable/Disable Two-Factor Authentication</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <Label>
            {!twoFactorEnabled
              ? "Enable Two-Factor Authentication"
              : "Disable Two-Factor Authentication"}
          </Label>
          <Switch checked={twoFactorEnabled} onCheckedChange={handleChange} />
        </div>

        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
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

            <form
              id="toggle-otp-form"
              onSubmit={toggleOtpForm.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FieldGroup>
                <Controller
                  name="password"
                  control={toggleOtpForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1">
                      <FieldLabel>Password</FieldLabel>
                      <Input
                        type="password"
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter password"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Button
                type="submit"
                form="toggle-otp-form"
                className="cursor-pointer"
              >
                {toggleOtpForm.formState.isSubmitting ? (
                  <Spinner className="size-6" />
                ) : !twoFactorEnabled ? (
                  "Enable 2FA"
                ) : (
                  "Disable 2FA"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ToggleOTPForm;
