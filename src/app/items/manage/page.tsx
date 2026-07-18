"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building,
  Plus,
  Trash2,
  MapPin,
  Bed,
  Bath,
  Maximize
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "../../../lib/auth-client";
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

export default function ManageListingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Route protection redirect
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    const fetchListings = async (email: string) => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listings?email=${email}`);
        const resData = await res.json();
        if (res.ok && resData.success) {
          setListings(resData.data || []);
        } else {
          toast.error(resData.message || "Failed to fetch listings");
        }
      } catch {
        toast.error("Failed to load listings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchListings(session.user.email);
    }
  }, [session]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing permanently? This cannot be undone.")) return;

    try {
      const res = await fetch(`/api/listings?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Listing deleted successfully!");
        setListings((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error(data.message || "Failed to delete listing.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    }
  };

  // Full-page Loading Skeleton
  if (isPending || !session) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 sm:py-32 space-y-8 animate-pulse select-none">
        <div className="flex justify-between items-center pb-8 border-b border-card-border">
          <div className="space-y-3">
            <div className="h-8 w-64 bg-card-border rounded" />
            <div className="h-4 w-96 bg-card-border rounded" />
          </div>
          <div className="h-10 w-36 bg-card-border rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-96 bg-card-bg border border-card-border rounded-2xl animate-pulse" />
          <div className="h-96 bg-card-bg border border-card-border rounded-2xl animate-pulse" />
          <div className="h-96 bg-card-bg border border-card-border rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 sm:py-32 space-y-8 text-foreground select-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 border-b border-card-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Manage My Listings</h1>
          <p className="text-sm text-muted font-semibold mt-1.5">
            Monitor and manage apartment listings you published on NestMatch.
          </p>
        </div>
        <Link
          href="/items/add"
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold bg-primary text-white hover:bg-primary-hover rounded-xl shadow-md shadow-primary/10 transition-all hover:shadow-primary/25 hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add Listing</span>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-96 bg-card-bg/40 border border-card-border rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center p-12 text-center bg-card-bg border border-card-border rounded-2xl shadow-sm space-y-4 max-w-lg mx-auto"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900/60 text-muted">
            <Building className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold">No active listings</h3>
            <p className="text-xs text-muted font-bold">
              You haven&apos;t listed any property space on NestMatch yet.
            </p>
          </div>
          <Link
            href="/items/add"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold bg-primary text-white hover:bg-primary-hover rounded-xl transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Publish Your First Listing</span>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {listings.map((listing) => (
              <motion.div
                key={listing._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="group bg-card-bg border border-card-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full"
              >
                {/* Image Showcase */}
                <div className="relative h-48 bg-slate-150 dark:bg-slate-900/80 overflow-hidden flex-shrink-0">
                  {listing.images && listing.images[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={listing.images[0].url}
                      alt={listing.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-350"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted bg-slate-100 dark:bg-slate-900/40">
                      <Building className="h-10 w-10" />
                    </div>
                  )}

                  {/* Property type badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-xxs font-extrabold bg-black/60 text-white backdrop-blur-sm rounded-lg uppercase tracking-wider">
                    {listing.propertyType}
                  </span>

                  {/* Furnished Status Badge */}
                  <span className="absolute top-3 right-3 px-2.5 py-1 text-xxs font-extrabold bg-primary text-white rounded-lg uppercase tracking-wider shadow-md shadow-primary/10">
                    {listing.furnished}
                  </span>
                </div>

                {/* Listing Core Specs */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-extrabold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {listing.title}
                      </h3>
                    </div>

                    <p className="text-xs text-muted font-semibold line-clamp-2">
                      {listing.shortDescription}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-muted font-bold">
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="truncate">
                        {listing.location.address}, {listing.location.city}
                      </span>
                    </div>
                  </div>

                  {/* Specs row */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-card-border text-center text-xs font-bold text-muted">
                    <div className="flex flex-col items-center gap-1 border-r border-card-border">
                      <Bed className="h-4 w-4 text-primary" />
                      <span>{listing.bedrooms} Beds</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 border-r border-card-border">
                      <Bath className="h-4 w-4 text-primary" />
                      <span>{listing.bathrooms} Baths</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Maximize className="h-4 w-4 text-primary" />
                      <span>{listing.sizeSqft} Sqft</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div>
                      <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Monthly Rent</p>
                      <p className="text-base font-black text-primary mt-0.5">
                        BDT {listing.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(listing._id)}
                        className="p-2.5 rounded-xl border border-rose-500/10 hover:border-rose-500/35 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete listing"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
