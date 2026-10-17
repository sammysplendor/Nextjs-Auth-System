"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useRouter } from "next/navigation";

const otpCodeSchema = z.object({
  code: z.string().min(6, "Invalid code"),
});

type OTPCodeSchema = z.infer<typeof otpCodeSchema>;

const OTPCodeForm = () => {
  const router = useRouter();

  const otpCodeForm = useForm<OTPCodeSchema>({
    resolver: zodResolver(otpCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (code: OTPCodeSchema) => {
    try {
      await authClient.twoFactor.verifyOtp(
        { code: code.code },
        {
          onSuccess: async () => {
            router.push("/");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        },
      );
    } catch (error) {
      console.error("2FA ERROR:", error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Enter your OTP code</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="otp-code"
          onSubmit={otpCodeForm.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FieldGroup>
            <Controller
              name="code"
              control={otpCodeForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel>Code</FieldLabel>
                  <Input
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

          <Button type="submit" form="otp-code" className="cursor-pointer">
            {otpCodeForm.formState.isSubmitting ? (
              <Spinner className="size-6" />
            ) : (
              "Verify"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default OTPCodeForm;
