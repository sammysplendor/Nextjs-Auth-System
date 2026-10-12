"use client";

import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Enter a valid password"),
    newPassword: z
      .string()
      .min(6, "Must be atleast 6 characters")
      .regex(/[a-zA-Z0-9^]/, "Must contain atleast 1 special character"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.confirmNewPassword === data.newPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

type passwordSchemaType = z.infer<typeof passwordSchema>;

const ChangePasswordForm = () => {
  const passwordForm = useForm<passwordSchemaType>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: passwordSchemaType) => {
    try {
      await authClient.changePassword(
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        {
          onSuccess: async () => {
            toast.success("Your password has been changed successfully");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        },
      );
    } catch (error) {
      console.error("CHANGE PASSWORD ERROR:", error);
    }
  };

  return (
    <Card className="w-full max-w-sm border-0 shadow-none">
      <CardHeader>
        <CardTitle>Update your password</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={passwordForm.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FieldGroup>
            <Controller
              name="currentPassword"
              control={passwordForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel>Current Password</FieldLabel>
                  <Input
                    type="password"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="newPassword"
              control={passwordForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel>New Password</FieldLabel>
                  <Input
                    type="password"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="confirmNewPassword"
              control={passwordForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel>Confirm New Password</FieldLabel>
                  <Input
                    type="password"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button type="submit" form="change-password button">
            {passwordForm.formState.isSubmitting ? (
              <Spinner className="size-6" />
            ) : (
              "Change Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordForm;
