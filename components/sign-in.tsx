"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "./ui/spinner";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Separator } from "./ui/separator";

const formSchema = z.object({
  email: z.email("Please enter a valid email.").trim(),
  password: z.string().min(6, "Please enter a valid password."),
});

type formType = z.infer<typeof formSchema>;

const SignInForm = () => {
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: formType) => {
    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: async () => {
            toast.success("Sign in successfull");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        },
      );
    } catch {
      throw new Error("Something went wrong");
    }
  };

  const signInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  const signInWithGithub = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
    });
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Sign in to your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="sign-in form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
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
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col">
        <Field
          orientation="horizontal"
          className="flex w-full itc justify-between"
        >
          <p className=" text-sm flex items-center gap-1.5">
            Do not have an account?
            <Link href="/sign-up" className="text-blue-500">
              <b>Sign Up</b>
            </Link>
          </p>
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              className="cursor-pointer"
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="sign-in form"
              className="cursor-pointer"
            >
              {form.formState.isSubmitting ? (
                <Spinner className="size-6" />
              ) : (
                "Sign In"
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
            onClick={signInWithGoogle}
          >
            Continue with Google
          </Button>
          <Button
            type="button"
            className="text-sm cursor-pointer"
            onClick={signInWithGithub}
          >
            Continue with GitHub
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignInForm;
