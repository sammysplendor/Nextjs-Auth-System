"use client";

import { columns, UserProps } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import useUser from "@/hooks/useUser";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const ROLE_OPTIONS = ["user", "admin", "superAdmin"] as const;
type Role = (typeof ROLE_OPTIONS)[number];

const userMgtFormSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.email("Email is required"),
  role: z.enum(ROLE_OPTIONS, "Role is required"),
  password: z.string().min(6, "Password is required").optional(),
});

type FormType = z.infer<typeof userMgtFormSchema>;

const UserManagementForm = ({ users }: { users: UserProps[] }) => {
  const router = useRouter();

  const userMgtForm = useForm<FormType>({
    resolver: zodResolver(userMgtFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      password: "",
    },
  });

  const { isOpen, setIsOpen, user, setUser } = useUser();

  useEffect(() => {
    if (user) {
      userMgtForm.setValue("name", user.name);
      userMgtForm.setValue("email", user.email);

      const role = ROLE_OPTIONS.find((r) => r === user.role);

      if (role) {
        userMgtForm.setValue("role", role);
      } else {
        userMgtForm.setValue("role", "user");
      }
    }
  }, [user, userMgtForm]);

  const onSubmit = async (values: FormType) => {
    try {
      if (!user.id) {
        await authClient.admin.createUser({
          name: values.name,
          email: values.email,
          password: values.password as string,
          role: values.role as Role,
        });

        toast.success("New user created successfully!");
      } else {
        await authClient.admin.updateUser({
          userId: user.id,
          data: {
            name: values.name,
            email: values.email,
            role: values.role as Role,
          },
        });

        toast.success("User updated successfully!");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("USER MANAGEMENT ERROR:", error);
    } finally {
      setIsOpen(false);
      userMgtForm.reset();

      setUser({
        id: "",
        name: "",
        role: "",
        email: "",
        emailVerify: false,
        hasDeletePermission: false,
      });

      router.refresh();
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(isOpen) => {
          userMgtForm.reset();
          setIsOpen(isOpen);
          if (!isOpen) {
            setUser({
              id: "",
              name: "",
              role: "",
              email: "",
              emailVerify: false,
              hasDeletePermission: false,
            });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{user.id ? "Edit" : "Create User"}</DialogTitle>
          </DialogHeader>

          <form
            id="user-mgt-form"
            onSubmit={userMgtForm.handleSubmit(onSubmit, (errors) =>
              console.log("ZOD VALIDATION ERRORS:", errors),
            )}
            className="flex flex-col items-end justify-center"
          >
            <FieldGroup>
              <Controller
                name="name"
                control={userMgtForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel>Name</FieldLabel>
                    <Input
                      type="text"
                      {...field}
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={userMgtForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      type="email"
                      {...field}
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {!user.id ? (
                <Controller
                  name="password"
                  control={userMgtForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1">
                      <FieldLabel>Password</FieldLabel>
                      <Input
                        type="password"
                        {...field}
                        autoComplete="off"
                        aria-invalid={fieldState.invalid}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              ) : null}

              <Controller
                name="role"
                control={userMgtForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel>Role</FieldLabel>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      defaultValue={user.role}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>

                      <SelectContent>
                        {ROLE_OPTIONS.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button
              type="submit"
              form="user-mgt-form"
              disabled={userMgtForm.formState.isSubmitting}
              className="cursor-pointer max-w-40 self-end my-6"
            >
              {userMgtForm.formState.isSubmitting ? (
                <Spinner className="size-6" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col p-8 w-full">
        <div className="flex w-full justify-between">
          <h1 className="text-lg">User Management</h1>
          <Button className="cursor-pointer" onClick={() => setIsOpen(true)}>
            Create New User
          </Button>
        </div>

        <div className="flex flex-col p-8">
          <DataTable data={users} columns={columns} />
        </div>
      </div>
    </>
  );
};

export default UserManagementForm;
