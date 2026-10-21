"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";

const emailSchema = z.object({
  email: z.email("Invalid email"),
});

type EmailSchema = z.infer<typeof emailSchema>;

const RequestPasswordForm = () => {
  const router = useRouter();

  const requestPasswordForm = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const [isEmailSent, setIsEmailSent] = useState(false);

  const onSubmit = async ({ email }: EmailSchema) => {
    try {
      const { data, error } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (data?.status) {
        toast.success("An email has been sent to you.");
        setIsEmailSent(true);
        router.refresh();
      }

      if (error) {
        toast.error(error.message);
        setIsEmailSent(false);
      }
    } catch (error) {
      console.error("PASSWORD RESET ERROR:", error);
    }
  };

  return (
    <>
      {isEmailSent ? (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex w-full p-6">
              <p>A password link has been sent to your email.</p>
            </div>
            <Button onClick={() => router.push("/sign-in")}>
              Back to Sign In
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Enter your email</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="request-password-form"
              onSubmit={requestPasswordForm.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FieldGroup>
                <Controller
                  name="email"
                  control={requestPasswordForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1">
                      <FieldLabel>Email</FieldLabel>
                      <Input
                        type="email"
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter email"
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
                form="request-password-form"
                className="cursor-pointer"
              >
                {requestPasswordForm.formState.isSubmitting ? (
                  <Spinner className="size-6" />
                ) : (
                  "Send Request"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default RequestPasswordForm;
