"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, HelpCircle, ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
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
          className="absolute -top-[10%] -left-[10%] w-[350px] h-[350px] rounded-full bg-primary/10 blur-[80px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] -right-[10%] w-[350px] h-[350px] rounded-full bg-secondary/15 blur-[80px]"
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
              NestMatch
            </span>
          </Link>
        </div>

        {/* 404 Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card-bg/85 dark:bg-card-bg/60 backdrop-blur-md border border-card-border shadow-xl rounded-3xl p-8 space-y-6"
        >
          {/* Animated 404 Illustration */}
          <div className="flex justify-center">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <HelpCircle className="h-12 w-12 animate-pulse" />
              <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider shadow">
                404
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              Page Not Found
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              We couldn&apos;t find the property or page you were looking for. It might have been moved or deleted.
            </p>
          </div>

          {/* Redirection Links */}
          <div className="flex flex-col gap-3 pt-2">
            <Link
              href="/"
              className="w-full py-3 px-4 rounded-xl bg-primary text-white hover:bg-primary-hover font-semibold text-sm shadow-md shadow-primary/10 transition-all hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none flex items-center justify-center gap-2 select-none"
            >
              <Home className="h-4 w-4" />
              <span>Back to Homepage</span>
            </Link>
            <Link
              href="/login"
              className="w-full py-3 px-4 rounded-xl border border-card-border bg-card-bg/25 text-foreground hover:bg-neutral-bg hover:border-primary/50 text-sm font-semibold transition-all active:scale-98 flex items-center justify-center gap-2 select-none"
            >
              <ArrowLeft className="h-4 w-4 text-primary" />
              <span>Go to Login</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
