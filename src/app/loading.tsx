"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background select-none">
      {/* Dynamic soft glow in the background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative flex flex-col items-center space-y-7">
        {/* Animated brand logo container */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 relative overflow-hidden"
        >
          {/* Inner sheen effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          <Sparkles className="h-8 w-8" />
        </motion.div>

        {/* Brand name and subtitle */}
        <div className="space-y-1.5 text-center">
          <motion.h1
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            NextMatch
          </motion.h1>
          <p className="text-[10px] text-muted font-black tracking-widest uppercase">
            Renting, Smarter
          </p>
        </div>

        {/* Wave-style animated bouncing dots */}
        <div className="flex items-center space-x-1.5">
          {[0, 1, 2].map((idx) => (
            <motion.div
              key={idx}
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: idx * 0.12,
              }}
              className="h-2 w-2 rounded-full bg-primary"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
