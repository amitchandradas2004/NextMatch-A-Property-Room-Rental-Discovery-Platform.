"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building,
  Search,
  Bed,
  Bath,
  Maximize,
  MapPin,
  ArrowRight,
  SlidersHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

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

export default function ApartmentsPage() {
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [maxPrice, setMaxPrice] = useState(250000);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/listings");
        const resData = await res.json();
        if (res.ok && resData.success) {
          setListings(resData.data || []);
        } else {
          toast.error(resData.message || "Failed to load apartments.");
        }
      } catch {
        toast.error("Failed to load listings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Filter logic
  const filteredListings = listings.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === "all" || item.propertyType === selectedType;
    const matchesPrice = item.price <= maxPrice;

    return matchesSearch && matchesType && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-neutral-bg text-foreground pb-24 select-none">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-slate-900 dark:bg-slate-950 py-24 sm:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-bg" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-3 py-1 text-xxs font-extrabold bg-primary/20 text-primary border border-primary/30 rounded-full uppercase tracking-widest"
          >
            Explore Spaces
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black tracking-tight text-white"
          >
            Find Your Next Cozy Match
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-sm sm:text-base text-slate-350 font-medium"
          >
            Browse real-time listings of flats, studios, shared spaces, and homes in your city. Premium amenities and secure verification.
          </motion.p>
        </div>
      </div>

      {/* Filter and Content Grid */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20 space-y-10">
        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xl space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted" />
              <input
                type="text"
                placeholder="Search by title, city, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 focus:ring-primary/10 dark:focus:ring-primary/15 focus:border-primary text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 transition-all duration-200 text-sm font-semibold"
              />
            </div>

            {/* Property type filter cards */}
            <div className="flex flex-wrap items-center gap-2">
              {["all", "apartment", "studio", "house", "room"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${selectedType === type
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 text-muted hover:text-foreground hover:border-slate-350 dark:hover:border-slate-700"
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="border-t border-card-border pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-extrabold text-muted">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <span>FILTER BY MAX PRICE:</span>
              <span className="text-foreground text-sm font-black ml-1">
                BDT {maxPrice.toLocaleString()}
              </span>
            </div>
            <div className="w-full sm:w-72">
              <input
                type="range"
                min="5000"
                max="250000"
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
        </motion.div>

        {/* Content Section */}
        {loading ? (
          /* Card Loading skeleton grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-[450px] bg-card-bg/40 border border-card-border rounded-3xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-16 text-center bg-card-bg border border-card-border rounded-3xl shadow-sm space-y-4 max-w-lg mx-auto"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900/60 text-muted">
              <Building className="h-7 w-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-extrabold text-foreground">No matches found</h3>
              <p className="text-xs text-muted font-bold px-4">
                We couldn&apos;t find any property listing matching your search criteria. Try modifying your filters or price limit.
              </p>
            </div>
          </motion.div>
        ) : (
          /* Cards Grid List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredListings.map((listing) => (
                <motion.div
                  key={listing._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-card-bg border border-card-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                >
                  {/* Image showcase wrapper */}
                  <div className="relative h-56 bg-slate-150 dark:bg-slate-900/80 overflow-hidden flex-shrink-0">
                    {listing.images && listing.images[0]?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={listing.images[0].url}
                        alt={listing.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted bg-slate-100 dark:bg-slate-900/40">
                        <Building className="h-10 w-10" />
                      </div>
                    )}

                    {/* Property type badge */}
                    <span className="absolute top-4 left-4 px-2.5 py-1 text-[10px] font-extrabold bg-black/60 text-white backdrop-blur-sm rounded-lg uppercase tracking-wider">
                      {listing.propertyType}
                    </span>

                    {/* Furnished Status Badge */}
                    <span className="absolute top-4 right-4 px-2.5 py-1 text-[10px] font-extrabold bg-primary text-white rounded-lg uppercase tracking-wider shadow-md shadow-primary/10">
                      {listing.furnished}
                    </span>
                  </div>

                  {/* Core specifications and details */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-extrabold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {listing.title}
                        </h3>
                      </div>

                      <p className="text-xs text-muted font-semibold line-clamp-2 leading-relaxed">
                        {listing.shortDescription}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-muted font-bold">
                        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="truncate">
                          {listing.location.address}, {listing.location.city}
                        </span>
                      </div>
                    </div>

                    {/* Specs Row */}
                    <div className="grid grid-cols-3 gap-2 py-3.5 border-y border-card-border text-center text-xs font-bold text-muted">
                      <div className="flex flex-col items-center gap-1 border-r border-card-border">
                        <Bed className="h-4 w-4 text-primary" />
                        <span>{listing.bedrooms} Beds</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 border-r border-card-border">
                        <Bath className="h-4 w-4 text-primary" />
                        <span>{listing.bathrooms} Beds</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <Maximize className="h-4 w-4 text-primary" />
                        <span>{listing.sizeSqft} Sqft</span>
                      </div>
                    </div>

                    {/* Price and Action button */}
                    <div className="flex justify-between items-center pt-2">
                      <div>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Monthly Rent</p>
                        <p className="text-lg font-black text-primary mt-0.5">
                          BDT {listing.price.toLocaleString()}
                        </p>
                      </div>

                      <Link
                        href={`/apartments/${listing._id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold bg-primary text-white hover:bg-primary-hover rounded-xl shadow-md shadow-primary/10 group-hover:shadow-primary/25 hover:-translate-y-0.5 transition-all cursor-pointer"
                      >
                        <span>View Details</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
