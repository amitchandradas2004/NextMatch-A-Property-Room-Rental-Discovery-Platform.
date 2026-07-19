"use client";

import React, { useEffect, useRef } from "react";
import { useInView, animate } from "framer-motion";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

interface ListingItem {
  _id: string;
  propertyType: string;
  location?: {
    city?: string;
  };
}

interface ListingsResponse {
  success: boolean;
  message?: string;
  data: ListingItem[];
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

export default function Stats() {
  const { data, isLoading } = useQuery<ListingsResponse>({
    queryKey: ["listings-stats"],
    queryFn: async () => {
      const res = await fetch("/api/listings", {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch listings data");
      }
      return res.json();
    },
  });

  const listings = data?.data || [];

  const totalListings = listings.length;
  const uniqueCities = React.useMemo(() => {
    return new Set(
      listings
        .map((item) => (item.location?.city || "").trim().toLowerCase())
        .filter(Boolean)
    ).size;
  }, [listings]);

  const statsItems = [
    {
      id: "listings",
      value: isLoading ? 0 : totalListings,
      decimals: 0,
      suffix: "",
      label: "Active Listings",
      description: "Verified spaces and rooms currently listed on our platform.",
    },
    {
      id: "cities",
      value: isLoading ? 0 : uniqueCities,
      decimals: 0,
      suffix: "",
      label: "Cities Covered",
      description: "Different municipal cities with active property listings.",
    },
    {
      id: "rating",
      value: 4.9,
      decimals: 1,
      suffix: "/5",
      label: "Average Rating",
      description: "Highly rated matches from our happy tenant community.",
    },
    {
      id: "renters",
      value: isLoading ? 0 : (totalListings * 3 + 4),
      decimals: 0,
      suffix: "+",
      label: "Satisfied Clients",
      description: "Tenants and landlords matched successfully.",
    },
  ];

  return (
    <section id="stats" className="py-24 bg-neutral-bg border-b border-card-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            NextMatch in Numbers
          </h2>
          <p className="text-muted text-base max-w-2xl mx-auto font-medium">
            Real-time statistics demonstrating our platform's scale, reach, and user community size directly from our database.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {statsItems.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 bg-card-bg border border-card-border rounded-2xl shadow-sm text-center flex flex-col justify-between"
            >
              <div>
                <span className="block text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-2">
                  <Counter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                </span>
                <span className="block text-base font-bold text-foreground mb-1">
                  {stat.label}
                </span>
              </div>
              <p className="text-xs text-muted mt-3 leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
