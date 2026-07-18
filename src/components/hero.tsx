"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, MapPin, Home, ArrowDown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "./theme-provider";

export default function Hero() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");

  React.useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  const imageSrc = mounted && theme === "dark"
    ? "/nextmatch_banner_dark.png"
    : "/nextmatch_banner_light.png";

  const propertyTypes = [
    { value: "apartment", label: "Apartments" },
    { value: "studio", label: "Studios" },
    { value: "house", label: "Houses" },
    { value: "room", label: "Shared Rooms" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Searching for ${propertyType || "properties"} in "${location || "all locations"}"`);
  };

  const scrollToNext = () => {
    const nextSection = document.getElementById("featured");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-32 pb-20 overflow-hidden bg-neutral-bg">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[40%] -right-[10%] w-[450px] h-[450px] rounded-full bg-secondary/10 blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Content (7 cols) */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI-Powered Rental Discovery</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight"
            >
              Find a place {"you'll"} <br />
              <span className="bg-gradient-to-r from-primary via-indigo-500 to-secondary bg-clip-text text-transparent">
                love to call home
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Smart matches tailored to your lifestyle. Browse listings or let our AI agent analyze
              options and summarize lease docs for you.
            </motion.p>

            {/* Search Bar Widget */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="w-full max-w-2xl"
            >
              <form
                onSubmit={handleSearch}
                className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-card-bg/85 dark:bg-card-bg/60 border border-card-border backdrop-blur-md rounded-2xl sm:rounded-full shadow-xl"
              >
                <div className="flex items-center gap-3 px-4 py-2 w-full sm:flex-1 border-b sm:border-b-0 sm:border-r border-card-border">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <label htmlFor="location" className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      placeholder="Where do you want to live?"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-transparent border-0 p-0 text-foreground placeholder-muted focus:outline-none focus:ring-0 text-sm mt-0.5"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-2 w-full sm:flex-1 border-b sm:border-b-0 border-card-border">
                  <Home className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <label htmlFor="property-type" className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                      Property Type
                    </label>
                    <select
                      id="property-type"
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full bg-transparent border-0 p-0 text-foreground focus:outline-none focus:ring-0 text-sm mt-0.5 appearance-none cursor-pointer"
                    >
                      <option value="" className="text-muted dark:bg-card-bg">
                        All Types
                      </option>
                      {propertyTypes.map((type) => (
                        <option key={type.value} value={type.value} className="text-foreground dark:bg-card-bg">
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 w-full sm:w-auto p-1">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl sm:rounded-full transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/10"
                  >
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Action Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <a
                href="#ai-features"
                className="group inline-flex items-center gap-2 px-6 py-3 border border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary font-semibold rounded-xl transition-all active:scale-98"
              >
                <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                <span>Let AI Find Your Match</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column: Visual Theme Banner Image (5 cols) */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative w-full max-w-md aspect-square rounded-3xl border border-card-border overflow-hidden bg-card-bg/50 backdrop-blur-sm p-4 shadow-2xl"
            >
              {/* Floating Animation wrap */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-full h-full relative"
              >
                <Image
                  src={imageSrc}
                  alt="Modern apartment illustration"
                  className="w-full h-full object-cover rounded-2xl shadow-inner select-none pointer-events-none transition-all duration-300"
                  width={500}
                  height={500}
                  priority
                />
              </motion.div>
            </motion.div>
          </div>

        </div>

        {/* Scroll down indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer hidden md:flex flex-col items-center gap-2 text-xs font-semibold text-muted hover:text-primary transition-colors"
          onClick={scrollToNext}
        >
          <span>Explore listings</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="h-4 w-4 text-primary" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
