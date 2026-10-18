import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";
import sendVerificationEmail from "./send-emails/send-verification-email";
import sendOtpEmail from "./send-emails/send-otp-email";
import sendResetPasswordEmail from "./send-emails/send-reset-password-email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ url }) => {
      void sendResetPasswordEmail({
        to: "splendidsam006@gmail.com",
        subject: "Reset your password",
        url,
      });
    },
  },

  rateLimit: {
    enabled: true,
    window: 10,
    max: 2,
  },

  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({
        to: "splendidsam006@gmail.com",
        verificationUrl: url,
        userName: user.name,
      });
    },
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      prompt: "select_account",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account",
    },
  },

  plugins: [
    twoFactor({
      otpOptions: {
        async sendOTP({ otp }) {
          sendOtpEmail({ to: "splendidsam006@gmail.com", otp });
        },
      },
    }),
    nextCookies(),
  ],
});
