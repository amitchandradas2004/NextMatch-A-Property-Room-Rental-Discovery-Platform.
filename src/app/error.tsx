"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Sparkles, AlertTriangle, RotateCcw, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Runtime error caught:", error);
  }, [error]);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-neutral-bg select-none">
      
      {/* Background glowing decorations */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[350px] h-[350px] rounded-full bg-rose-500/10 blur-[80px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] -right-[10%] w-[350px] h-[350px] rounded-full bg-primary/10 blur-[80px]"
        />
      </div>

      <div className="relative z-10 w-full max-w-md text-center space-y-8">
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              NextMatch
            </span>
          </Link>
        </div>

        {/* Error Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card-bg/85 dark:bg-card-bg/60 backdrop-blur-md border border-card-border shadow-xl rounded-3xl p-8 space-y-6"
        >
          {/* Animated Warning Illustration */}
          <div className="flex justify-center">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <AlertTriangle className="h-12 w-12 animate-bounce" />
              <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow">
                Error
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              Something went wrong!
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              An unexpected error occurred during execution. Our team has been notified.
            </p>
            {error.digest && (
              <p className="text-[10px] font-mono text-muted/65 select-all">
                Digest ID: {error.digest}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="w-full py-3 px-4 rounded-xl bg-primary text-white hover:bg-primary-hover font-semibold text-sm shadow-md shadow-primary/10 transition-all hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none flex items-center justify-center gap-2 select-none"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
            <Link
              href="/"
              className="w-full py-3 px-4 rounded-xl border border-card-border bg-card-bg/25 text-foreground hover:bg-neutral-bg hover:border-primary/50 text-sm font-semibold transition-all active:scale-98 flex items-center justify-center gap-2 select-none"
            >
              <Home className="h-4 w-4 text-primary" />
              <span>Back to Homepage</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
