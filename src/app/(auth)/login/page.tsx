"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Loader2, AlertCircle, CheckCircle2, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import AuthInput from "../../../components/auth-input";
import PasswordInput from "../../../components/password-input";
import GoogleButton from "../../../components/google-button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Schema validation using Zod
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;



export default function LoginPage() {
  const [isDemoToastOpen, setIsDemoToastOpen] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const handleDemoFill = () => {
    setValue("email", "demouser@nextmatch.com", { shouldValidate: true });
    setValue("password", "demouser@123", { shouldValidate: true });
    setIsDemoToastOpen(true);
    setApiError(null);
    setTimeout(() => {
      setIsDemoToastOpen(false);
    }, 2500);
  };

  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const onSubmit = async (values: LoginFormValues) => {
    setApiError(null);
    setApiSuccess(null);
    try {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: "/",
      });
      if (error) {
        setApiError(error.message || "Invalid email or password.");
        toast.error(error.message || "Invalid email or password.");
        return;
      }

      setApiSuccess("Login successful!");
      toast.success(
        <div>
          <h3 className="font-heading text-base font-bold text-slate-900">Welcome Back!</h3>
          <p className="font-body mt-1 text-sm text-slate-600">
            You have successfully signed in to <span className="font-semibold text-indigo-600">NestMatch</span>.
          </p>
        </div>
      );
      router.push("/");
    } catch {
      setApiError("Network error. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <div className="space-y-6">
      {" "}
      <div>
        {" "}
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          Welcome back
        </h1>{" "}
        <p className="text-sm text-muted mt-1.5 leading-relaxed">
          Log in to find your next home
        </p>{" "}
      </div>{" "}
      <AnimatePresence>
        {" "}
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs font-semibold"
          >
            {" "}
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />{" "}
            <span>{apiError}</span>{" "}
          </motion.div>
        )}{" "}
        {apiSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-450 text-xs font-semibold"
          >
            {" "}
            <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />{" "}
            <span>{apiSuccess}</span>{" "}
          </motion.div>
        )}{" "}
        {isDemoToastOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3.5 rounded-xl bg-primary/10 border border-primary/25 text-primary text-xs font-bold"
          >
            {" "}
            <UserCheck className="h-4.5 w-4.5" />{" "}
            <span>Demo credentials filled! Form is ready to submit.</span>{" "}
          </motion.div>
        )}{" "}
      </AnimatePresence>{" "}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {" "}
        <AuthInput
          id="email"
          label="Email Address"
          placeholder="name@example.com"
          icon={Mail}
          error={errors.email?.message}
          disabled={isSubmitting}
          {...register("email")}
        />{" "}
        <PasswordInput
          id="password"
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          disabled={isSubmitting}
          {...register("password")}
        />{" "}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-xl bg-primary text-white hover:bg-primary-hover font-semibold text-sm shadow-md shadow-primary/10 transition-all hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed select-none"
        >
          {" "}
          {isSubmitting ? (
            <>
              {" "}
              <Loader2 className="h-4 w-4 animate-spin" /> <span>Logging in...</span>{" "}
            </>
          ) : (
            <span>Log In</span>
          )}{" "}
        </button>{" "}
      </form>{" "}
      <button
        type="button"
        onClick={handleDemoFill}
        disabled={isSubmitting}
        className="w-full py-3 px-4 rounded-xl border border-dashed border-card-border bg-card-bg/20 text-foreground hover:bg-neutral-bg hover:border-primary/50 text-sm font-semibold transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed select-none"
      >
        {" "}
        <UserCheck className="h-4 w-4 text-primary" />{" "}
        <span>Try Demo Account</span>{" "}
      </button>{" "}{" "}
      <div className="flex items-center gap-4 py-2">
        {" "}
        <div className="h-px bg-card-border flex-grow" />{" "}
        <span className="text-[10px] font-bold text-muted uppercase tracking-wider select-none">
          {" "}
          or continue with{" "}
        </span>{" "}
        <div className="h-px bg-card-border flex-grow" />{" "}
      </div>{" "}
      <GoogleButton
        onClick={handleGoogleSignIn}
        disabled={isSubmitting}
      />{" "}
      <p className="text-center text-xs text-muted font-medium pt-2 select-none">
        {" "}
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-bold text-primary hover:underline hover:text-primary-hover transition-colors"
        >
          {" "}
          Sign up{" "}
        </Link>{" "}
      </p>{" "}
    </div>
  );
}
