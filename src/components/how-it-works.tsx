"use client";

import React from "react";
import { Search, Sparkles, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Find Your Space",
    description: "Search tailored properties based on your custom budget, exact preferences, and desired location.",
    icon: Search,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    number: "02",
    title: "Compare with AI",
    description: "Our recommendation engine compares features and our AI lease summarizer flags clauses instantly.",
    icon: Sparkles,
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  {
    number: "03",
    title: "Move In Seamlessly",
    description: "Finalize details with verified hosts directly, sign your lease securely, and claim your new keys.",
    icon: CheckCircle,
    color: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-neutral-bg border-b border-card-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight">How NextMatch Works</h2>
          <p className="text-muted mt-3 text-base">
            Rent smarter, faster, and with absolute confidence. Our 3-step streamlined workflow does all the heavy lifting.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-card-border z-0" />

          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="flex flex-col items-center text-center relative z-10 group"
            >
              {/* Step Icon & Number */}
              <div className="relative mb-6">
                <div className={`w-24 h-24 rounded-2xl ${step.color} border border-card-border flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all`}>
                  <step.icon className="h-10 w-10" />
                </div>
                <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-card-bg border border-card-border text-xs font-black shadow-sm flex items-center justify-center text-foreground/80">
                  {step.number}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                {step.title}
              </h3>
              <p className="text-sm text-muted max-w-xs leading-relaxed">
                {step.description}
              </p>

              {/* Arrow Connector between steps (only on desktop and not for the last step) */}
              {idx < 2 && (
                <div className="hidden md:flex absolute top-16 -right-6 translate-x-1/2 z-20 items-center justify-center w-8 h-8 rounded-full bg-card-bg border border-card-border text-muted">
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
