"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Sun, Moon, ArrowLeft } from "lucide-react";
import { useTheme } from "../../components/theme-provider";
import { AnimatePresence, motion } from "framer-motion";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();

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

      {/* Floating Theme Toggle and Back-to-Home */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center max-w-7xl mx-auto px-2">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-bold text-muted hover:text-primary transition-colors bg-card-bg/60 border border-card-border backdrop-blur-sm px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-card-border bg-card-bg/60 backdrop-blur-sm text-foreground/80 hover:text-primary hover:border-primary/40 active:scale-95 transition-all shadow-sm"
          aria-label="Toggle Dark/Light Mode"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ y: -10, opacity: 0, rotate: -45 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 10, opacity: 0, rotate: 45 }}
              transition={{ duration: 0.15 }}
            >
              {theme === "dark" ? (
                <Sun className="h-4.5 w-4.5 text-accent" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-primary" />
              )}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      {/* Main card positioning */}
      <div className="relative z-10 w-full max-w-md mt-6">
        {/* Brand Logo Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              NextMatch
            </span>
          </Link>
        </div>

        {/* Dynamic Inner Card Content */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full bg-card-bg/85 dark:bg-card-bg/60 backdrop-blur-md border border-card-border shadow-xl rounded-3xl p-8"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
