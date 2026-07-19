"use client";

import React from "react";
import { Building, Layout, Home, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

interface Category {
  id: string;
  dbType: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  hoverBorder: string;
}

interface ListingItem {
  _id: string;
  propertyType: string;
}

interface ListingsResponse {
  success: boolean;
  message?: string;
  data: ListingItem[];
}

const categories: Category[] = [
  {
    id: "apartments",
    dbType: "apartment",
    name: "Apartments",
    icon: Building,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    hoverBorder: "hover:border-blue-500/30",
  },
  {
    id: "studios",
    dbType: "studio",
    name: "Studios",
    icon: Layout,
    color: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    hoverBorder: "hover:border-teal-500/30",
  },
  {
    id: "houses",
    dbType: "house",
    name: "Houses",
    icon: Home,
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    hoverBorder: "hover:border-rose-500/30",
  },
  {
    id: "shared-rooms",
    dbType: "room",
    name: "Shared Rooms",
    icon: Users,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    hoverBorder: "hover:border-amber-500/30",
  },
];

export default function Categories() {
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

  const counts = React.useMemo(() => {
    const countsMap = {
      apartment: 0,
      studio: 0,
      house: 0,
      room: 0,
    };
    listings.forEach((item) => {
      const type = (item.propertyType || "").toLowerCase();
      if (type in countsMap) {
        countsMap[type as keyof typeof countsMap]++;
      }
    });
    return countsMap;
  }, [listings]);

  return (
    <section id="categories" className="py-24 bg-background border-b border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Browse by Category</h2>
            <p className="text-muted mt-2 text-base max-w-md">
              Find exactly what {"you're"} looking for by filtering through specific building layouts.
            </p>
          </div>
          <Link
            href="/apartments"
            className="self-start md:self-auto text-sm font-semibold text-primary hover:text-primary-hover flex items-center gap-1.5 hover:underline group"
          >
            <span>View All Categories</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, idx) => {
            const count = counts[category.dbType as keyof typeof counts] || 0;
            const countText = isLoading
              ? "Loading..."
              : `${count} ${count === 1 ? "Listing" : "Listings"}`;

            return (
              <Link
                href={`/apartments?type=${category.dbType}`}
                key={category.id}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className={`p-6 rounded-2xl border border-card-border bg-card-bg cursor-pointer hover:shadow-md hover:shadow-primary/5 transition-all flex flex-col items-start group h-full w-full ${category.hoverBorder}`}
                >
                  {/* Category Icon */}
                  <div className={`p-4 rounded-xl ${category.color} mb-6 group-hover:scale-110 transition-transform`}>
                    <category.icon className="h-6 w-6" />
                  </div>

                  {/* Title & Count */}
                  <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted font-medium">
                    {countText}
                  </p>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
