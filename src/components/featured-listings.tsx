"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Star, MapPin, Home, ArrowUpRight, Building } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ListingItem {
  _id: string;
  title: string;
  shortDescription: string;
  propertyType: string;
  furnished: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;
  location: {
    address: string;
    city: string;
  };
  images?: { url: string }[];
}

export default function FeaturedListings() {
  const [properties, setProperties] = useState<ListingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/listings");
        const resData = await res.json();
        if (res.ok && resData.success) {
          // Take first 6 listings from db
          setProperties((resData.data || []).slice(0, 6));
        }
      } catch (err) {
        console.error("Failed to load featured listings:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <section id="featured" className="py-24 bg-background border-y border-card-border relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Featured Listings</h2>
            <p className="text-muted mt-2 text-base max-w-lg">
              Explore our hand-picked accommodations matching top safety and luxury ratings.
            </p>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {isLoading
              ? // Skeleton State
                Array.from({ length: 3 }).map((_, idx) => (
                  <motion.div
                    key={`skeleton-${idx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col h-full rounded-2xl border border-card-border bg-card-bg overflow-hidden shadow-sm animate-pulse"
                  >
                    <div className="w-full h-48 bg-slate-200 dark:bg-slate-800" />
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                      </div>
                      <div className="pt-4 border-t border-card-border flex items-center justify-between">
                        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                      </div>
                    </div>
                  </motion.div>
                ))
              : // Real Properties from DB
                properties.map((property, idx) => (
                  <motion.div
                    key={property._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="flex flex-col h-full rounded-2xl border border-card-border bg-card-bg overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 transition-all group"
                  >
                    {/* Visual Card Media */}
                    <div className="relative w-full h-48 overflow-hidden bg-slate-100 dark:bg-slate-900/60 flex items-center justify-center border-b border-card-border">
                      {property.images && property.images[0]?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={property.images[0].url}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted bg-slate-100 dark:bg-slate-900/40">
                          <Building className="h-10 w-10" />
                        </div>
                      )}
                      
                      {/* Rating Badge */}
                      <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md text-white text-xs font-bold">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>4.8</span>
                      </div>

                      {/* Property Type Badge */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider">
                        <Home className="h-3 w-3" />
                        <span>{property.propertyType}</span>
                      </div>
                    </div>

                    {/* Card details */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        {/* Location */}
                        <div className="flex items-center gap-1 text-xs text-muted mb-2 font-medium">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          <span className="truncate">{property.location.address}, {property.location.city}</span>
                        </div>
                        {/* Title */}
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-2">
                          {property.title}
                        </h3>
                        {/* Description */}
                        <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-4">
                          {property.shortDescription}
                        </p>
                      </div>

                      {/* Bottom row */}
                      <div className="pt-4 border-t border-card-border flex items-center justify-between mt-auto">
                        <div>
                          <span className="block text-xs text-muted font-medium">Price</span>
                          <span className="text-base font-extrabold text-foreground">BDT {property.price.toLocaleString()}</span>
                        </div>
                        <Link
                          href={`/apartments/${property._id}`}
                          className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold bg-primary/5 dark:bg-primary/10 hover:bg-primary hover:text-white dark:hover:bg-primary text-primary rounded-lg transition-all cursor-pointer"
                        >
                          <span>View Details</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
