"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import ImageUpload from "./image-upload";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .refine(
      (val) => {
        const parts = val.trim().split(/\s+/);
        return parts.length >= 2 && parts.every((part) => part.length >= 2);
      },
      {
        message: "Enter both first and last name (at least 2 characters each).",
      },
    ),
  email: z.email("Enter a valid email"),
  image: z.string("Image is required"),
  twoFactorEnabled: z.boolean(),
});

type ProfileSchemaType = z.infer<typeof profileSchema>;

const ProfileForm = ({
  name,
  email,
  image,
  twoFactorEnabled,
}: ProfileSchemaType) => {
  const profileForm = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name,
      email,
      image,
      twoFactorEnabled: false,
    },
  });

  const onSubmit = async (data: ProfileSchemaType) => {
    try {
      await authClient.updateUser(
        {
          name: data.name,
          image: data.image,
        },
        {
          onSuccess: async () => {
            toast.success("Profile updated successfully!");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        },
      );
    } catch (error) {
      console.error("PROFLE UPDATE ERROR:", error);
    }
  };

  return (
    <Card className="w-full max-w-sm border-0 shadow-none">
      <CardHeader>
        <CardTitle>Update your profile details</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          action=""
          id="profile-form"
          className="flex flex-col gap-6"
          onSubmit={profileForm.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              name="name"
              control={profileForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel>Fullname</FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    id="name"
                    placeholder="Enter your fullname"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={profileForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    aria-invalid={fieldState.invalid}
                    disabled
                    autoComplete="off"
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="image"
              control={profileForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel>Image</FieldLabel>
                  <ImageUpload
                    endpoint="imageUploader"
                    defaultUrl={field.value}
                    onChange={(url) => {
                      field.onChange(url);
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button type="submit" form="sign-in form" className="cursor-pointer">
            {profileForm.formState.isSubmitting ? (
              <Spinner className="size-6" />
            ) : (
              "Update Profile"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
