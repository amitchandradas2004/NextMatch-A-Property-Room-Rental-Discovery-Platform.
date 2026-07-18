"use client";

import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  initials: string;
  quote: string;
  rating: number;
  avatarBg: string;
}

const testimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Sarah Jenkins",
    role: "Product Designer",
    initials: "SJ",
    quote: "NextMatch's AI engine found me a quiet studio in Seattle with high-speed fiber and an active tech vibe. It understood my prompt exactly on the first try!",
    rating: 5,
    avatarBg: "bg-blue-600",
  },
  {
    id: "test-2",
    name: "David Chen",
    role: "Software Engineer",
    initials: "DC",
    quote: "The AI lease summarizer is a lifesaver. It scanned a 35-page agreement and flagged a hidden monthly convenience fee and restrictive sublet clauses.",
    rating: 5,
    avatarBg: "bg-indigo-600",
  },
  {
    id: "test-3",
    name: "Elena Rostova",
    role: "Graduate Student",
    initials: "ER",
    quote: "Relocating from Chicago to Austin was stressful until I tried NextMatch. The recommendation agent mapped safety ratings and commute lines for me.",
    rating: 5,
    avatarBg: "bg-teal-600",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-24 bg-background border-b border-card-border overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight">What Our Renters Say</h2>
          <p className="text-muted mt-2 text-base">
            Discover how real tenants use NextMatch to find homes and protect themselves from bad leases.
          </p>
        </div>

        <div className="relative min-h-[320px] sm:min-h-[260px] flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full p-8 sm:p-12 rounded-3xl bg-neutral-bg border border-card-border shadow-sm flex flex-col items-center justify-between text-center relative"
            >
              <Quote className="absolute top-6 left-8 h-10 w-10 text-primary/10" />

              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <blockquote className="text-lg sm:text-xl font-medium text-foreground leading-relaxed mb-6 italic max-w-2xl">
                &quot;{testimonials[currentIndex].quote}&quot;
              </blockquote>

              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${testimonials[currentIndex].avatarBg} text-white font-bold flex items-center justify-center shadow-md`}>
                  {testimonials[currentIndex].initials}
                </div>
                <div className="text-left">
                  <span className="block font-bold text-foreground">{testimonials[currentIndex].name}</span>
                  <span className="block text-xs text-muted font-medium">{testimonials[currentIndex].role}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={handlePrev}
            className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-12 p-3 rounded-full border border-card-border bg-card-bg text-foreground hover:text-primary hover:border-primary/50 shadow-md transition-all active:scale-95"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={handleNext}
            className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-12 p-3 rounded-full border border-card-border bg-card-bg text-foreground hover:text-primary hover:border-primary/50 shadow-md transition-all active:scale-95"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-8 bg-primary" : "w-2.5 bg-card-border hover:bg-muted"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
