"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building,
  Plus,
  Trash2,
  Bed,
  Bath,
  Maximize,
  Eye,
  ShieldAlert,
  Loader2,
  X,
  Bookmark
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "../../lib/auth-client";
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

interface SavedItem {
  _id: string; // bookmark id
  listingId: string;
  listing: ListingItem;
}

export default function SavedListingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [savedList, setSavedList] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookmarkToRemove, setBookmarkToRemove] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  // Route protection redirect
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    const fetchSavedListings = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/saved");
        const resData = await res.json();
        if (res.ok && resData.success) {
          setSavedList(resData.data || []);
        } else {
          toast.error(resData.message || "Failed to fetch saved listings.");
        }
      } catch {
        toast.error("Failed to load bookmarks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchSavedListings();
    }
  }, [session]);

  const openDeleteModal = (savedId: string) => {
    setBookmarkToRemove(savedId);
    setDeleteModalOpen(true);
  };

  const confirmRemoveBookmark = async () => {
    if (!bookmarkToRemove) return;

    try {
      setIsRemoving(true);
      const res = await fetch(`/api/saved?id=${bookmarkToRemove}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Bookmark removed successfully!");
        setSavedList((prev) => prev.filter((item) => item._id !== bookmarkToRemove));
      } else {
        toast.error(data.message || "Failed to remove bookmark.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsRemoving(false);
      setDeleteModalOpen(false);
      setBookmarkToRemove(null);
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
        <div className="border border-card-border rounded-2xl overflow-hidden bg-card-bg">
          <div className="h-12 bg-neutral-bg/60 border-b border-card-border" />
          <div className="p-4 space-y-4">
            <div className="h-8 bg-card-border rounded-xl" />
            <div className="h-8 bg-card-border rounded-xl" />
            <div className="h-8 bg-card-border rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 sm:py-32 space-y-8 text-foreground select-none">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 border-b border-card-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Saved Apartments</h1>
          <p className="text-sm text-muted font-semibold mt-1.5">
            View and manage apartments you bookmarked for later.
          </p>
        </div>
        <Link
          href="/apartments"
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold bg-primary text-white hover:bg-primary-hover rounded-xl shadow-md shadow-primary/10 transition-all hover:shadow-primary/25 hover:-translate-y-0.5 cursor-pointer"
        >
          <Building className="h-4.5 w-4.5" />
          <span>Browse Apartments</span>
        </Link>
      </div>

      {loading ? (
        <div className="border border-card-border rounded-2xl overflow-hidden bg-card-bg animate-pulse">
          <div className="h-12 bg-neutral-bg/60 border-b border-card-border" />
          <div className="p-4 space-y-4">
            <div className="h-8 bg-card-border rounded-xl" />
            <div className="h-8 bg-card-border rounded-xl" />
            <div className="h-8 bg-card-border rounded-xl" />
          </div>
        </div>
      ) : savedList.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center p-12 text-center bg-card-bg border border-card-border rounded-2xl shadow-sm space-y-4 max-w-lg mx-auto"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900/60 text-muted">
            <Bookmark className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold">No saved apartments</h3>
            <p className="text-xs text-muted font-bold">
              You haven&apos;t saved any property listings on NestMatch yet.
            </p>
          </div>
          <Link
            href="/apartments"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold bg-primary text-white hover:bg-primary-hover rounded-xl transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Find Apartments to Save</span>
          </Link>
        </motion.div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-card-border bg-card-bg shadow-sm animate-in fade-in duration-300">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-card-border bg-neutral-bg/50 text-[10px] font-bold text-muted uppercase tracking-wider select-none">
                <th className="px-6 py-4">Preview</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Specifications</th>
                <th className="px-6 py-4">Monthly Rent</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border text-sm font-semibold text-foreground">
              <AnimatePresence mode="popLayout">
                {savedList.map((item) => (
                  <motion.tr
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-neutral-bg/30 transition-colors"
                  >
                    {/* Image Preview */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-10 w-14 rounded-lg bg-slate-100 dark:bg-slate-900/60 overflow-hidden flex items-center justify-center border border-card-border flex-shrink-0">
                        {item.listing.images && item.listing.images[0]?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.listing.images[0].url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Building className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-6 py-4">
                      <div className="max-w-[200px] truncate">
                        <p className="font-extrabold text-foreground truncate">{item.listing.title}</p>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider mt-0.5">
                          {item.listing.propertyType} • {item.listing.furnished}
                        </p>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4">
                      <div className="max-w-[180px] truncate text-xs font-bold text-muted">
                        <p className="text-foreground font-semibold truncate">{item.listing.location.address}</p>
                        <p className="truncate mt-0.5">{item.listing.location.city}</p>
                      </div>
                    </td>

                    {/* Specifications */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-muted">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Bed className="h-3.5 w-3.5 text-primary" />
                          <span>{item.listing.bedrooms} Beds</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="h-3.5 w-3.5 text-primary" />
                          <span>{item.listing.bathrooms} Baths</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Maximize className="h-3.5 w-3.5 text-primary" />
                          <span>{item.listing.sizeSqft} Sqft</span>
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-black text-primary">
                        BDT {item.listing.price.toLocaleString()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/apartments/${item.listing._id}`}
                          className="p-2 rounded-xl border border-card-border hover:border-primary/30 text-muted hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                          title="View Apartment Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(item._id)}
                          className="p-2 rounded-xl border border-rose-500/10 hover:border-rose-500/35 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Remove Bookmark"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isRemoving) {
                  setDeleteModalOpen(false);
                  setBookmarkToRemove(null);
                }
              }}
              className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-card-border bg-card-bg shadow-xl p-6 select-none"
            >
              {/* Close Button */}
              <button
                type="button"
                disabled={isRemoving}
                onClick={() => {
                  setDeleteModalOpen(false);
                  setBookmarkToRemove(null);
                }}
                className="absolute top-4 right-4 p-1.5 rounded-xl border border-card-border text-muted hover:text-foreground hover:bg-neutral-bg/40 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col items-center text-center space-y-4">
                {/* Warning Badge Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 dark:bg-rose-500/5 text-rose-500 animate-bounce duration-1000">
                  <ShieldAlert className="h-6 w-6" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-extrabold text-foreground">
                    Remove Saved Bookmark?
                  </h3>
                  <p className="text-xs text-muted font-bold px-2">
                    Are you sure you want to remove this apartment from your saved bookmarks list?
                  </p>
                </div>

                <div className="flex gap-3 w-full pt-2">
                  <button
                    type="button"
                    disabled={isRemoving}
                    onClick={() => {
                      setDeleteModalOpen(false);
                      setBookmarkToRemove(null);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-card-border text-xs font-extrabold text-foreground hover:bg-neutral-bg/40 transition-all cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isRemoving}
                    onClick={confirmRemoveBookmark}
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-500/10 hover:shadow-rose-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isRemoving ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Removing...</span>
                      </>
                    ) : (
                      <span>Remove bookmark</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
