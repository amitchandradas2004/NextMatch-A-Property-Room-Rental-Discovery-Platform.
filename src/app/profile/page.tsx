"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Mail,
  Camera,
  Calendar,
  ShieldAlert,
  Key,
  Trash2,
  Building,
  Heart,
  Loader2,
  User,
  LogOut,
  X,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "../../lib/auth-client";
import toast from "react-hot-toast";

import AuthInput from "../../components/auth-input";
import PasswordInput from "../../components/password-input";

// Profile Edit Zod Schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

// Password Change Zod Schema
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .refine((val) => /[a-zA-Z]/.test(val), "Password must include at least one letter")
      .refine((val) => /[0-9]/.test(val), "Password must include at least one number"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

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
  _id: string;
  listingId: string;
  listing: ListingItem;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [createdListings, setCreatedListings] = useState<ListingItem[]>([]);
  const [savedListings, setSavedListings] = useState<SavedItem[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);

  const {
    data: session,
    isPending,
  } = authClient.useSession();
  const user = session?.user;
  const isDemoUser = user?.email === "demouser@nextmatch.com";

  // New deletion states
  const [listingToDelete, setListingToDelete] = useState<ListingItem | null>(null);
  const [isDeletingListing, setIsDeletingListing] = useState(false);
  const [bookmarkToRemove, setBookmarkToRemove] = useState<SavedItem | null>(null);
  const [isRemovingBookmark, setIsRemovingBookmark] = useState(false);
  const [isDemoRestrictionModalOpen, setIsDemoRestrictionModalOpen] = useState(false);

  // Route protection redirect
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    const fetchProfileData = async (email: string) => {
      try {
        setLoadingListings(true);
        // Fetch created listings
        const createdRes = await fetch(`/api/listings?email=${email}`);
        const createdData = await createdRes.json();
        if (createdRes.ok && createdData.success) {
          setCreatedListings(createdData.data || []);
        }

        // Fetch saved listings
        const savedRes = await fetch("/api/saved");
        const savedData = await savedRes.json();
        if (savedRes.ok && savedData.success) {
          setSavedListings(savedData.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch profile activities:", err);
      } finally {
        setLoadingListings(false);
      }
    };

    if (session?.user?.email) {
      fetchProfileData(session.user.email);
    }
  }, [session]);

  const handleDeleteCreated = (listing: ListingItem) => {
    setListingToDelete(listing);
  };

  const confirmDeleteCreated = async () => {
    if (!listingToDelete) return;
    const id = listingToDelete._id;

    try {
      setIsDeletingListing(true);
      const res = await fetch(`/api/listings?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Listing deleted successfully!");
        setCreatedListings((prev) => prev.filter((item) => item._id !== id));
        setListingToDelete(null);
      } else {
        toast.error(data.message || "Failed to delete listing.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsDeletingListing(false);
    }
  };

  const handleRemoveSaved = (item: SavedItem) => {
    setBookmarkToRemove(item);
  };

  const confirmRemoveSaved = async () => {
    if (!bookmarkToRemove) return;
    const savedId = bookmarkToRemove._id;

    try {
      setIsRemovingBookmark(true);
      const res = await fetch(`/api/saved?id=${savedId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Bookmark removed successfully!");
        setSavedListings((prev) => prev.filter((item) => item._id !== savedId));
        setBookmarkToRemove(null);
      } else {
        toast.error(data.message || "Failed to remove bookmark.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsRemovingBookmark(false);
    }
  };

  // Profile Form initialization
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    setValue: setProfileValue,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
  });

  // Prepopulate edit form values when user state resolves
  useEffect(() => {
    if (user) {
      setProfileValue("name", user.name);
      setProfileValue("image", user.image || "");
    }
  }, [user, setProfileValue]);

  // Password Form initialization
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onBlur",
  });

  // Format creation Date helper
  const formatMemberSince = (dateString?: string | Date) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // Submit profile edits
  const onProfileSubmit = async (values: ProfileFormValues) => {
    if (isDemoUser) {
      toast.error("Profile editing is disabled for the demo user.");
      return;
    }
    try {
      const { error } = await authClient.updateUser({
        name: values.name,
        image: values.image || undefined,
      });

      if (error) {
        toast.error(error.message || "Failed to update profile");
      } else {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        router.refresh();
      }
    } catch {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  // Submit password updates
  const onPasswordSubmit = async (values: ChangePasswordValues) => {
    if (isDemoUser) {
      toast.error("Password change is disabled for the demo user.");
      return;
    }
    try {
      const { error } = await authClient.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (error) {
        toast.error(error.message || "Failed to change password");
      } else {
        toast.success("Password changed successfully!");
        setIsPasswordModalOpen(false);
        resetPasswordForm();
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    }
  };

  // Submit account deletion
  const onDeleteConfirm = async () => {
    if (isDemoUser) {
      toast.error("Account deletion is disabled for the demo user.");
      return;
    }
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm account removal.");
      return;
    }
    try {
      setIsDeleting(true);
      const { error } = await authClient.deleteUser();
      if (error) {
        toast.error(error.message || "Failed to delete account");
      } else {
        toast.success("Your account has been deleted.");
        router.push("/");
      }
    } catch {
      toast.error("An error occurred during account deletion.");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setDeleteConfirmText("");
    }
  };

  // Sign out handler
  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully");
            router.push("/");
          }
        }
      });
    } catch {
      toast.error("Failed to log out");
    }
  };

  // Full-page Loading Skeleton
  if (isPending || !session || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 sm:py-32 space-y-8 animate-pulse select-none">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-card-border">
          <div className="h-24 w-24 rounded-full bg-card-border" />
          <div className="space-y-3 flex-1 text-center sm:text-left">
            <div className="h-6 w-48 bg-card-border rounded mx-auto sm:mx-0" />
            <div className="h-4 w-36 bg-card-border rounded mx-auto sm:mx-0" />
            <div className="h-4 w-24 bg-card-border rounded mx-auto sm:mx-0" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div className="h-64 bg-card-bg border border-card-border rounded-2xl" />
          </div>
          <div className="space-y-6 sm:space-y-8">
            <div className="h-44 bg-card-bg border border-card-border rounded-2xl" />
            <div className="h-48 bg-card-bg border border-card-border rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 sm:py-32 space-y-8 text-foreground select-none">
      {/* 1. HEADER SECTION */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-card-border"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          {/* Avatar container */}
          <div className="relative h-24 w-24 rounded-full border border-card-border bg-primary/10 text-primary font-black text-3xl flex items-center justify-center overflow-hidden">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <span>{user.name ? user.name[0].toUpperCase() : "U"}</span>
            )}
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{user.name}</h1>
            <p className="text-sm sm:text-base text-muted font-semibold flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </p>
            <p className="text-xs sm:text-sm text-muted font-bold flex items-center justify-center sm:justify-start gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Member since {formatMemberSince(user.createdAt)}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (isDemoUser) {
              setIsDemoRestrictionModalOpen(true);
              return;
            }
            setIsEditing(!isEditing);
          }}
          className={`px-4 py-2 text-sm font-bold rounded-xl border transition-all cursor-pointer ${
            isEditing
              ? "border-rose-500/50 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
              : "border-card-border bg-card-bg hover:bg-neutral-bg text-foreground"
          }`}
        >
          {isEditing ? "Cancel Edit" : "Edit Profile"}
        </button>
      </motion.div>

      {/* Main grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* 2. ACCOUNT INFORMATION CARD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Account Information</h2>
              <p className="text-xs text-muted font-bold mt-1">Manage your private identity details</p>
            </div>

            {isEditing ? (
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                <AuthInput
                  id="name"
                  label="Full Name"
                  placeholder="Jane Doe"
                  icon={User}
                  error={profileErrors.name?.message}
                  disabled={isProfileSubmitting}
                  {...registerProfile("name")}
                />

                <div className="space-y-1">
                  <AuthInput
                    id="email"
                    label="Email Address"
                    value={user.email}
                    disabled
                    icon={Mail}
                  />
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block pl-1">
                    Contact support to change your email address.
                  </span>
                </div>

                <AuthInput
                  id="image"
                  label="Profile Image URL"
                  placeholder="https://example.com/avatar.jpg"
                  icon={Camera}
                  error={profileErrors.image?.message}
                  disabled={isProfileSubmitting}
                  {...registerProfile("image")}
                />

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isProfileSubmitting}
                    className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProfileSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={isProfileSubmitting}
                    className="px-4 py-2.5 border border-card-border hover:bg-neutral-bg text-sm font-bold rounded-xl cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-muted uppercase tracking-wider">Full Name</span>
                  <p className="text-sm font-extrabold text-foreground">{user.name}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-muted uppercase tracking-wider">Email Address</span>
                  <p className="text-sm font-extrabold text-foreground">{user.email}</p>
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <span className="text-xs font-bold text-muted uppercase tracking-wider">Profile Image URL</span>
                  <p className="text-sm font-semibold text-foreground break-all truncate">
                    {user.image || "Not Provided"}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column - Stats / Actions */}
        <div className="space-y-6 sm:space-y-8">
          {/* 3. MY LISTINGS SUMMARY CARD */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div>
              <h2 className="text-base font-extrabold tracking-tight">My Activity</h2>
              <p className="text-xs text-muted font-bold mt-1">Check your listings statistics</p>
            </div>

            {/* Stat Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-bg rounded-xl border border-card-border flex flex-col items-center justify-center text-center space-y-1.5">
                <Building className="h-5 w-5 text-primary" />
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Created</span>
                <span className="text-lg font-black text-foreground">
                  {loadingListings ? <Loader2 className="h-4 w-4 animate-spin text-muted" /> : createdListings.length}
                </span>
              </div>
              <div className="p-4 bg-neutral-bg rounded-xl border border-card-border flex flex-col items-center justify-center text-center space-y-1.5">
                <Heart className="h-5 w-5 text-rose-500" />
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Saved</span>
                <span className="text-lg font-black text-foreground">
                  {loadingListings ? <Loader2 className="h-4 w-4 animate-spin text-muted" /> : savedListings.length}
                </span>
              </div>
            </div>

            <Link
              href="/items/manage"
              className="w-full py-3 bg-neutral-bg hover:bg-card-border text-foreground font-bold text-xs uppercase tracking-wider border border-card-border rounded-xl transition-all cursor-pointer block text-center"
            >
              View My Listings
            </Link>
          </motion.div>

          {/* 4. SECURITY / ACCOUNT ACTIONS CARD */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div>
              <h2 className="text-base font-extrabold tracking-tight">Security & Settings</h2>
              <p className="text-xs text-muted font-bold mt-1">Manage your access constraints</p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  if (isDemoUser) {
                    setIsDemoRestrictionModalOpen(true);
                    return;
                  }
                  setIsPasswordModalOpen(true);
                }}
                className="w-full py-3 bg-neutral-bg hover:bg-card-border text-foreground font-bold text-xs uppercase tracking-wider border border-card-border rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Key className="h-4 w-4 text-primary" />
                <span>Change Password</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full py-3 bg-neutral-bg hover:bg-card-border text-foreground font-bold text-xs uppercase tracking-wider border border-card-border rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4 text-muted" />
                <span>Log Out</span>
              </button>

              <button
                onClick={() => {
                  if (isDemoUser) {
                    setIsDemoRestrictionModalOpen(true);
                    return;
                  }
                  setIsDeleteModalOpen(true);
                }}
                className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-600 dark:text-rose-450 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Published and Saved listings of the current user */}
      <div className="space-y-10 pt-6">
        {/* Created Listings Table */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            <span>My Published Listings</span>
          </h2>
          {loadingListings ? (
            <div className="h-28 bg-card-bg border border-card-border rounded-2xl animate-pulse" />
          ) : createdListings.length === 0 ? (
            <div className="p-8 text-center bg-card-bg border border-card-border rounded-2xl text-xs font-bold text-muted">
              You haven&apos;t published any property listings yet.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-card-border bg-card-bg shadow-sm">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-card-border bg-neutral-bg/50 text-[10px] font-bold text-muted uppercase tracking-wider">
                    <th className="px-6 py-4">Preview</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Monthly Rent</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border text-sm font-semibold text-foreground">
                  {createdListings.map((listing) => (
                    <tr key={listing._id} className="hover:bg-neutral-bg/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-10 w-14 rounded-lg bg-slate-100 dark:bg-slate-900/60 overflow-hidden flex items-center justify-center border border-card-border flex-shrink-0">
                          {listing.images && listing.images[0]?.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={listing.images[0].url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <Building className="h-4 w-4 text-slate-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-[220px] truncate">
                          <p className="font-extrabold text-foreground truncate">{listing.title}</p>
                          <p className="text-[10px] font-bold text-muted uppercase tracking-wider mt-0.5">{listing.propertyType}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-foreground truncate max-w-[200px]">{listing.location.address}, {listing.location.city}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-black text-primary">BDT {listing.price.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/apartments/${listing._id}`}
                            className="p-2 rounded-xl border border-card-border hover:border-primary/30 text-muted hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteCreated(listing)}
                            className="p-2 rounded-xl border border-rose-500/10 hover:border-rose-500/35 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Saved Listings Table */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            <span>My Bookmarked Apartments</span>
          </h2>
          {loadingListings ? (
            <div className="h-28 bg-card-bg border border-card-border rounded-2xl animate-pulse" />
          ) : savedListings.length === 0 ? (
            <div className="p-8 text-center bg-card-bg border border-card-border rounded-2xl text-xs font-bold text-muted">
              You haven&apos;t saved any listings yet.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-card-border bg-card-bg shadow-sm">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-card-border bg-neutral-bg/50 text-[10px] font-bold text-muted uppercase tracking-wider">
                    <th className="px-6 py-4">Preview</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Monthly Rent</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border text-sm font-semibold text-foreground">
                  {savedListings.map((item) => (
                    <tr key={item._id} className="hover:bg-neutral-bg/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-10 w-14 rounded-lg bg-slate-100 dark:bg-slate-900/60 overflow-hidden flex items-center justify-center border border-card-border flex-shrink-0">
                          {item.listing.images && item.listing.images[0]?.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.listing.images[0].url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <Building className="h-4 w-4 text-slate-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-[220px] truncate">
                          <p className="font-extrabold text-foreground truncate">{item.listing.title}</p>
                          <p className="text-[10px] font-bold text-muted uppercase tracking-wider mt-0.5">{item.listing.propertyType}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-foreground truncate max-w-[200px]">{item.listing.location.address}, {item.listing.location.city}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-black text-primary">BDT {item.listing.price.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/apartments/${item.listing._id}`}
                            className="p-2 rounded-xl border border-card-border hover:border-primary/30 text-muted hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleRemoveSaved(item)}
                            className="p-2 rounded-xl border border-rose-500/10 hover:border-rose-500/35 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-card-bg border border-card-border p-6 rounded-2xl shadow-xl space-y-5 text-foreground z-10 overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight">Change Password</h3>
                  <p className="text-xs text-muted font-bold mt-0.5">Protect and renew your security locks</p>
                </div>
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-card-border transition-colors text-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                <PasswordInput
                  id="currentPassword"
                  label="Current Password"
                  placeholder="••••••••"
                  error={passwordErrors.currentPassword?.message}
                  disabled={isPasswordSubmitting}
                  {...registerPassword("currentPassword")}
                />

                <PasswordInput
                  id="newPassword"
                  label="New Password"
                  placeholder="••••••••"
                  error={passwordErrors.newPassword?.message}
                  disabled={isPasswordSubmitting}
                  {...registerPassword("newPassword")}
                />

                <PasswordInput
                  id="confirmPassword"
                  label="Confirm New Password"
                  placeholder="••••••••"
                  error={passwordErrors.confirmPassword?.message}
                  disabled={isPasswordSubmitting}
                  {...registerPassword("confirmPassword")}
                />

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isPasswordSubmitting}
                    className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isPasswordSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>Update Password</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPasswordModalOpen(false);
                      resetPasswordForm();
                    }}
                    disabled={isPasswordSubmitting}
                    className="px-4 py-2.5 border border-card-border hover:bg-neutral-bg text-sm font-bold rounded-xl cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE ACCOUNT MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isDeleting) {
                  setIsDeleteModalOpen(false);
                  setDeleteConfirmText("");
                }
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-card-bg border border-card-border p-6 rounded-2xl shadow-xl space-y-5 text-foreground z-10 overflow-hidden"
            >
              <div className="flex items-start gap-3 text-rose-500">
                <ShieldAlert className="h-6 w-6 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight">Delete Account permanently?</h3>
                  <p className="text-xs text-rose-600/75 dark:text-rose-450/75 font-semibold mt-0.5">
                    This action is destructive and cannot be undone. All your listings, session databases, and details will be wiped.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5 w-full select-none text-left">
                  <label htmlFor="confirmDelete" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Type DELETE to confirm
                  </label>
                  <input
                    id="confirmDelete"
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="DELETE"
                    disabled={isDeleting}
                    className="w-full py-3 px-4 rounded-xl border border-rose-500/30 bg-rose-500/5 focus:ring-rose-500/20 focus:border-rose-500 text-slate-900 dark:text-slate-100 placeholder-rose-500/30 focus:outline-none focus:ring-4 transition-all duration-200 text-sm font-semibold"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={onDeleteConfirm}
                    disabled={isDeleting || deleteConfirmText !== "DELETE"}
                    className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>Confirm Delete</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setDeleteConfirmText("");
                    }}
                    disabled={isDeleting}
                    className="px-4 py-2.5 border border-card-border hover:bg-neutral-bg text-sm font-bold rounded-xl cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE LISTING CONFIRMATION MODAL */}
      <AnimatePresence>
        {listingToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isDeletingListing) setListingToDelete(null);
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-card-bg border border-card-border p-6 rounded-2xl shadow-xl space-y-5 text-foreground z-10 overflow-hidden"
            >
              <div className="flex items-start gap-3 text-rose-500">
                <ShieldAlert className="h-6 w-6 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight">Delete Listing Permanently?</h3>
                  <p className="text-xs text-rose-600/75 dark:text-rose-450/75 font-semibold mt-0.5">
                    This will permanently delete the listing for <span className="font-extrabold">&ldquo;{listingToDelete.title}&rdquo;</span>. This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={confirmDeleteCreated}
                  disabled={isDeletingListing}
                  className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isDeletingListing && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Delete Listing</span>
                </button>
                <button
                  type="button"
                  onClick={() => setListingToDelete(null)}
                  disabled={isDeletingListing}
                  className="flex-1 py-2.5 border border-card-border hover:bg-neutral-bg text-sm font-bold rounded-xl cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REMOVE BOOKMARK CONFIRMATION MODAL */}
      <AnimatePresence>
        {bookmarkToRemove && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isRemovingBookmark) setBookmarkToRemove(null);
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-card-bg border border-card-border p-6 rounded-2xl shadow-xl space-y-5 text-foreground z-10 overflow-hidden"
            >
              <div className="flex items-start gap-3 text-amber-500">
                <ShieldAlert className="h-6 w-6 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight">Remove Bookmark?</h3>
                  <p className="text-xs text-muted font-bold mt-0.5">
                    Are you sure you want to remove <span className="font-extrabold">&ldquo;{bookmarkToRemove.listing.title}&rdquo;</span> from your saved bookmarks list?
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={confirmRemoveSaved}
                  disabled={isRemovingBookmark}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isRemovingBookmark && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Remove Bookmark</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBookmarkToRemove(null)}
                  disabled={isRemovingBookmark}
                  className="flex-1 py-2.5 border border-card-border hover:bg-neutral-bg text-sm font-bold rounded-xl cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DEMO ACCOUNT PROTECTION RESTRICTION MODAL */}
      <AnimatePresence>
        {isDemoRestrictionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDemoRestrictionModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-card-bg border border-card-border p-6 rounded-2xl shadow-xl space-y-5 text-foreground z-10 overflow-hidden"
            >
              <div className="flex items-start gap-3 text-primary">
                <ShieldAlert className="h-6 w-6 flex-shrink-0 mt-0.5 text-primary" />
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight">Demo Account Protection</h3>
                  <p className="text-xs text-muted font-bold mt-1.5 leading-relaxed">
                    You are logged in under the shared public demo email <span className="text-foreground font-extrabold">demouser@nextmatch.com</span>.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-card-border rounded-xl text-xs font-semibold leading-relaxed text-muted">
                To protect this shared demo user account for other potential visitors, profile edits, credentials changes, and permanent account deletions are completely restricted. You can register your own personal email to try out these settings at any time!
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/register"
                  onClick={() => setIsDemoRestrictionModalOpen(false)}
                  className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs uppercase tracking-wider font-extrabold rounded-xl text-center shadow-md hover:-translate-y-0.5 transition-all cursor-pointer block"
                >
                  Create Account
                </Link>
                <button
                  type="button"
                  onClick={() => setIsDemoRestrictionModalOpen(false)}
                  className="flex-1 py-2.5 border border-card-border hover:bg-neutral-bg text-xs uppercase tracking-wider font-extrabold rounded-xl cursor-pointer"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
