"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Loader2, AlertCircle, CheckCircle2, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import AuthInput from "../../../components/auth-input";
import PasswordInput from "../../../components/password-input";
import GoogleButton from "../../../components/google-button";

// Register Schema using Zod
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine((val) => /[a-zA-Z]/.test(val), "Password must include at least one letter")
      .refine((val) => /[0-9]/.test(val), "Password must include at least one number"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    agree: z.literal(true, {
      message: "You must accept the terms and privacy policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

// Mock API Call to easily wire in backend later
const authApi = {
  register: async (values: RegisterFormValues): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: `Account created successfully for ${values.name}!` });
      }, 1500);
    });
  },
};

export default function RegisterPage() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const passwordVal = watch("password", "");

  // Strength algorithm (0 to 3)
  const calculateStrength = (pass: string): { score: number; label: string; color: string } => {
    if (!pass) return { score: 0, label: "", color: "bg-card-border" };
    let score = 0;

    if (pass.length >= 8) score += 1;
    const hasLetter = /[a-zA-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);
    const hasUpper = /[A-Z]/.test(pass);

    if (hasLetter && hasNumber) score += 1;
    if (pass.length >= 10 && (hasSpecial || hasUpper)) score += 1;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-rose-500" };
    if (score === 2) return { score: 2, label: "Medium", color: "bg-amber-500" };
    return { score: 3, label: "Strong", color: "bg-emerald-500" };
  };

  const strength = calculateStrength(passwordVal);

  const onSubmit = async (values: RegisterFormValues) => {
    setApiError(null);
    setApiSuccess(null);
    try {
      console.log(values);
      const response = await authApi.register(values);
      if (response.success) {
        setApiSuccess(response.message);
      } else {
        setApiError(response.message);
      }
    } catch {
      setApiError("Registration failed. Please check your connection.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="text-sm text-muted mt-1.5 leading-relaxed">
          Join NestMatch and find your perfect place
        </p>
      </div>

      <AnimatePresence>
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-450 text-xs font-semibold"
          >
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </motion.div>
        )}

        {apiSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-450 text-xs font-semibold"
          >
            <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
            <span>{apiSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthInput
          id="name"
          label="Full Name"
          placeholder="Jane Doe"
          icon={User}
          error={errors.name?.message}
          disabled={isSubmitting}
          {...register("name")}
        />

        <AuthInput
          id="email"
          label="Email Address"
          placeholder="name@example.com"
          icon={Mail}
          error={errors.email?.message}
          disabled={isSubmitting}
          {...register("email")}
        />

        <div>
          <PasswordInput
            id="password"
            label="Password"
            placeholder="••••••••"
            error={errors.password?.message}
            disabled={isSubmitting}
            {...register("password")}
          />

          {passwordVal && (
            <div className="mt-1 space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-muted uppercase">
                <span>Password Strength</span>
                <span className={strength.score === 3 ? "text-emerald-500" : strength.score === 2 ? "text-amber-500" : "text-rose-500"}>
                  {strength.label}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: strength.score === 3 ? "100%" : strength.score === 2 ? "66%" : "33%",
                  }}
                  transition={{ duration: 0.2 }}
                  className={`h-full ${strength.color}`}
                />
              </div>
            </div>
          )}
        </div>

        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          disabled={isSubmitting}
          {...register("confirmPassword")}
        />

        <div className="flex flex-col gap-1.5 pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              id="agree"
              disabled={isSubmitting}
              className="h-4.5 w-4.5 mt-0.5 rounded-lg border-card-border bg-card-bg text-primary focus:ring-primary/20 transition-colors accent-primary"
              {...register("agree")}
            />
            <span className="text-xs text-muted leading-relaxed font-semibold">
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline hover:text-primary-hover">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline hover:text-primary-hover">
                Privacy Policy
              </Link>
            </span>
          </label>
          <div className="min-h-[1.25rem] overflow-hidden">
            <AnimatePresence>
              {errors.agree && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-xs text-rose-500 font-semibold"
                >
                  {errors.agree.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-xl bg-primary text-white hover:bg-primary-hover font-semibold text-sm shadow-md shadow-primary/10 transition-all hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed select-none"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </form>

      <div className="flex items-center gap-4 py-2">
        <div className="h-px bg-card-border flex-grow" />
        <span className="text-[10px] font-bold text-muted uppercase tracking-wider select-none">
          or continue with
        </span>
        <div className="h-px bg-card-border flex-grow" />
      </div>

      <GoogleButton
        onClick={() => alert("Redirecting to Google authentication...")}
        disabled={isSubmitting}
      />

      <p className="text-center text-xs text-muted font-medium pt-2 select-none">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-primary hover:underline hover:text-primary-hover transition-colors"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
