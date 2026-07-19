"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useInView, animate } from "framer-motion";
import { Building, AlertTriangle } from "lucide-react";
import { useTheme } from "./theme-provider";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ListingItem {
  _id: string;
  propertyType: string;
}

interface ListingsResponse {
  success: boolean;
  message?: string;
  data: ListingItem[];
  pagination?: {
    total?: number;
  };
}

function Counter({ value, decimals = 0, suffix = "" }: { value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView && ref.current) {
      const node = ref.current;
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate(latestValue) {
          const numFormatted = latestValue.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          });
          node.textContent = numFormatted + suffix;
        },
      });

      return () => controls.stop();
    }
  }, [value, inView, decimals, suffix]);

  return <span ref={ref} className="tabular-nums">0{suffix}</span>;
}

export default function PlatformGrowth() {
  const { theme } = useTheme();
  
  // Fetch listings from /api/listings
  const { data, isLoading, isError } = useQuery<ListingsResponse>({
    queryKey: ["listings-stats"],
    queryFn: async () => {
      const res = await fetch("/api/listings", {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch statistics data");
      }
      const resData = await res.json();
      if (!resData.success) {
        throw new Error(resData.message || "Failed to load listings data");
      }
      return resData;
    },
  });

  // Calculate totals and counts
  const totalListings = data?.pagination?.total ?? data?.data?.length ?? 0;
  const listingsArray = data?.data || [];

  const counts = listingsArray.reduce(
    (acc, curr) => {
      const type = (curr.propertyType || "").toLowerCase();
      if (type === "apartment") acc.apartment++;
      else if (type === "studio") acc.studio++;
      else if (type === "house") acc.house++;
      else if (type === "room") acc.room++;
      return acc;
    },
    { apartment: 0, studio: 0, house: 0, room: 0 }
  );

  const chartData = [
    { name: "Apartment", count: counts.apartment },
    { name: "Studio", count: counts.studio },
    { name: "House", count: counts.house },
    { name: "Room", count: counts.room },
  ];

  // Dynamic styles for the chart depending on the theme
  const textColor = theme === "dark" ? "#94a3b8" : "#64748b"; // slate-400 : slate-500
  const gridColor = theme === "dark" ? "#1f2937" : "#e2e8f0"; // slate-800 : slate-200
  const barColor = theme === "dark" ? "#6366f1" : "#4f46e5";  // Indigo-500 : Indigo-600

  // Custom tooltips matching theme
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card-bg border border-card-border p-3 rounded-2xl shadow-xl">
          <p className="text-xs font-bold text-foreground">{payload[0].payload.name}</p>
          <p className="text-sm font-extrabold text-primary mt-1">
            {payload[0].value} {payload[0].value === 1 ? "Listing" : "Listings"}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isError) {
    return (
      <section id="platform-growth" className="py-24 bg-neutral-bg border-b border-card-border relative select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight">Growing Every Day</h2>
            <p className="text-muted mt-2 text-base">
              Explore our expanding collection of verified rental listings
            </p>
          </div>
          <div className="flex flex-col items-center justify-center p-12 bg-card-bg border border-card-border rounded-2xl shadow-sm max-w-md mx-auto text-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-foreground">Stats temporarily unavailable</h3>
              <p className="text-xs text-muted font-bold mt-1">
                We are having trouble loading the statistics. Please try reloading the page.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section id="platform-growth" className="py-24 bg-neutral-bg border-b border-card-border relative select-none animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-2/3 mx-auto" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-5/6 mx-auto" />
          </div>

          {/* Stat Card Skeleton */}
          <div className="max-w-xs mx-auto mb-12">
            <div className="p-6 bg-card-bg border border-card-border rounded-2xl shadow-sm text-center space-y-4">
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3 mx-auto" />
              <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2 mx-auto" />
            </div>
          </div>

          {/* Chart Skeleton */}
          <div className="max-w-3xl mx-auto p-6 bg-card-bg border border-card-border rounded-2xl shadow-sm h-64 flex items-end justify-around space-x-4">
            <div className="w-16 bg-slate-200 dark:bg-slate-800 rounded-t-lg h-2/3" />
            <div className="w-16 bg-slate-200 dark:bg-slate-800 rounded-t-lg h-1/2" />
            <div className="w-16 bg-slate-200 dark:bg-slate-800 rounded-t-lg h-5/6" />
            <div className="w-16 bg-slate-200 dark:bg-slate-800 rounded-t-lg h-1/3" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="platform-growth" className="py-24 bg-neutral-bg border-b border-card-border relative select-none overflow-hidden">
      {/* Decorative background blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold tracking-tight text-foreground"
          >
            Growing Every Day
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted mt-3 text-base font-medium"
          >
            Explore our expanding collection of verified rental listings
          </motion.p>
        </div>

        {/* Total Listings Stat Card */}
        <div className="max-w-xs mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 bg-card-bg border border-card-border rounded-2xl shadow-sm text-center flex flex-col items-center justify-center space-y-4 hover:shadow-md hover:border-primary/20 transition-all group relative overflow-hidden"
          >
            {/* Soft background highlight on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
              <Building className="h-6 w-6" />
            </div>
            
            <div className="space-y-1 z-10">
              <span className="block text-4xl sm:text-5xl font-extrabold tracking-tight text-primary">
                <Counter value={totalListings} />
              </span>
              <span className="block text-sm font-bold text-foreground uppercase tracking-wider">
                Total Listings
              </span>
            </div>
          </motion.div>
        </div>

        {/* Listings Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-3xl mx-auto p-6 bg-card-bg border border-card-border rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
        >
          <div className="mb-6">
            <h3 className="text-base font-extrabold text-foreground">Listings by Property Type</h3>
            <p className="text-xs text-muted font-semibold mt-0.5">Distribution across major renting categories</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: textColor, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: textColor, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }} />
                <Bar 
                  dataKey="count" 
                  fill={barColor} 
                  radius={[8, 8, 0, 0]} 
                  maxBarSize={50}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
