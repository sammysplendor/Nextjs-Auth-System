"use client";

import z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { redirect } from "next/navigation";
import { Separator } from "./ui/separator";

const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .refine(
        (val) => {
          const parts = val.trim().split(/\s+/);
          return parts.length >= 2 && parts.every((part) => part.length >= 2);
        },
        {
          message:
            "Enter both first and last name (at least 2 characters each).",
        },
      ),
    email: z.email("Please enter a valid email"),
    password: z
      .string()
      .min(6, "Must be atleast 6 characters")
      .regex(/[^a-zA-Z0-9]/, "Must contain atleast 1 special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type formType = z.infer<typeof formSchema>;

const SignUpForm = () => {
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: formType) => {
    try {
      await authClient.signUp.email(
        {
          name: data.name,
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: async () => {
            toast.success("Sign up successfull");
            redirect("/sign-in");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        },
      );
    } catch (error) {
      console.error("SIGN UP ERROR:", error);
    }
  };

  const signUpWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  const signUpWithGithub = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
    });
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>
          Enter your credentials to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="sign-up form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Fullname</FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    id="name"
                    aria-invalid={fieldState.invalid}
                    placeholder="John Doe"
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
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    id="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="johndoe@example.com"
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
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    id="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="* * * * * *"
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
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    id="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="* * * * * *"
                    autoComplete="off"
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col">
        <Field
          orientation="horizontal"
          className="flex w-full itc justify-between"
        >
          <p className="text-sm flex items-center gap-1.5">
            Already have an account?
            <Link href="/sign-in" className="text-blue-500">
              <b>Sign In</b>
            </Link>
          </p>
          <>
            <Button
              type="reset"
              variant="outline"
              onClick={() => form.reset()}
              className="cursor-pointer"
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="sign-up form"
              className="cursor-pointer"
            >
              {form.formState.isSubmitting ? (
                <Spinner className="size-6" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </>
        </Field>
        <div className="flex flex-col gap-2 w-full my-4 items-center justify-center">
          <p className="text-sm my-4">Or</p>
          <Separator className="gap-6" />
        </div>

        <div className="flex flex-col w-full gap-2">
          <Button
            type="button"
            className="text-sm cursor-pointer"
            onClick={signUpWithGoogle}
          >
            Continue with Google
          </Button>
          <Button
            type="button"
            className="text-sm cursor-pointer"
            onClick={signUpWithGithub}
          >
            Continue with GitHub
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignUpForm;
