"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building,
  MapPin,
  Bed,
  Bath,
  Maximize,
  ChevronLeft,
  ChevronRight,
  ParkingCircle,
  Cat,
  User,
  Mail,
  Loader2,
  ExternalLink,
  CheckCircle2,
  FileCheck
} from "lucide-react";
import toast from "react-hot-toast";

interface ListingItem {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  propertyType: string;
  furnished: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;
  location: {
    address: string;
    city: string;
    nearbyLandmark?: string;
  };
  floorNumber: number;
  totalFloors: number;
  furnishedStatus: string;
  parkingAvailable: boolean;
  petsAllowed: boolean;
  availableFrom: string;
  minimumLeaseMonths: number;
  amenities: string[];
  images: { url: string }[];
  leaseDocumentUrl?: string;
  addedBy?: string;
  user?: {
    name?: string;
    email?: string;
  };
}

export default function ApartmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [listing, setListing] = useState<ListingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listings?id=${id}`);
        const resData = await res.json();
        if (res.ok && resData.success) {
          setListing(resData.data);
        } else {
          toast.error(resData.message || "Failed to load listing details.");
          router.push("/apartments");
        }
      } catch {
        toast.error("Failed to connect to the database. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, router]);

  // Format date helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Immediate";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted select-none">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-extrabold">Loading listing details...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-neutral-bg flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md p-6 select-none">
          <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <Building className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-black text-foreground">Listing not found</h2>
          <p className="text-xs text-muted font-bold">
            The property listing you are trying to view does not exist or has been removed.
          </p>
          <Link
            href="/apartments"
            className="inline-block py-2.5 px-6 bg-primary text-white hover:bg-primary-hover font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            Back to Apartments
          </Link>
        </div>
      </div>
    );
  }

  const hasImages = listing.images && listing.images.length > 0;

  return (
    <div className="min-h-screen bg-neutral-bg text-foreground pb-24 select-none">
      {/* Top Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 pt-24 sm:pt-32 pb-6">
        <Link
          href="/apartments"
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-muted hover:text-foreground transition-colors cursor-pointer group"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Apartments</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Column: Image Showcase, Description, Specs, Amenities */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title & Location Header */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 text-[10px] font-extrabold bg-primary/10 text-primary border border-primary/20 rounded-lg uppercase tracking-wider">
                {listing.propertyType}
              </span>
              <span className="px-2.5 py-1 text-[10px] font-extrabold bg-slate-100 dark:bg-slate-900/60 border border-card-border rounded-lg uppercase tracking-wider">
                {listing.furnished}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {listing.title}
            </h1>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center text-sm text-muted font-bold">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4.5 w-4.5 text-primary flex-shrink-0" />
                <span>
                  {listing.location.address}, {listing.location.city}
                </span>
              </div>
              {listing.location.nearbyLandmark && (
                <span className="hidden sm:inline text-slate-350 dark:text-slate-700">•</span>
              )}
              {listing.location.nearbyLandmark && (
                <span className="text-[10px] font-extrabold text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg border border-primary/20 uppercase tracking-wider w-max">
                  Near {listing.location.nearbyLandmark}
                </span>
              )}
            </div>
          </div>

          {/* Media Slider */}
          <div className="bg-card-bg border border-card-border rounded-3xl overflow-hidden shadow-sm">
            {/* Main Showcase Image */}
            <div className="relative h-96 sm:h-[450px] bg-slate-150 dark:bg-slate-900/80 overflow-hidden flex items-center justify-center">
              {hasImages ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={listing.images[activeImageIndex].url}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted">
                  <Building className="h-12 w-12" />
                  <p className="text-xs font-bold">No images uploaded</p>
                </div>
              )}

              {/* Slider Arrows */}
              {hasImages && listing.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === 0 ? listing.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 p-2 rounded-xl bg-black/60 hover:bg-black text-white hover:scale-105 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === listing.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 p-2 rounded-xl bg-black/60 hover:bg-black text-white hover:scale-105 transition-all cursor-pointer"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Slider Thumbnails */}
            {hasImages && listing.images.length > 1 && (
              <div className="flex items-center gap-2.5 p-4 border-t border-card-border overflow-x-auto bg-card-bg">
                {listing.images.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative h-14 w-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIndex === index
                        ? "border-primary scale-95"
                        : "border-transparent hover:border-slate-350 dark:hover:border-slate-700"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-foreground">Property Description</h2>
            <div className="text-sm font-semibold text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-card-bg border border-card-border p-6 rounded-2xl shadow-sm">
              {listing.fullDescription}
            </div>
          </div>

          {/* Specifications Checklist details */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-foreground">Property Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-card-bg border border-card-border p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between border-b border-card-border/50 pb-3">
                <span className="text-xs font-bold text-muted uppercase">Floor Position</span>
                <span className="text-sm font-extrabold text-foreground">
                  {listing.floorNumber === 0 ? "Ground Floor" : `${listing.floorNumber}th Floor`}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-card-border/50 pb-3">
                <span className="text-xs font-bold text-muted uppercase">Total Floors</span>
                <span className="text-sm font-extrabold text-foreground">
                  {listing.totalFloors} Floors
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-card-border/50 sm:border-b-0 pb-3 sm:pb-0">
                <span className="text-xs font-bold text-muted uppercase">Available From</span>
                <span className="text-sm font-extrabold text-foreground">
                  {formatDate(listing.availableFrom)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted uppercase">Minimum Lease</span>
                <span className="text-sm font-extrabold text-foreground">
                  {listing.minimumLeaseMonths ? `${listing.minimumLeaseMonths} Months` : "Flexible"}
                </span>
              </div>
            </div>
          </div>

          {/* Amenities checklist details */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-foreground">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {listing.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3.5 bg-card-bg border border-card-border rounded-xl text-xs font-extrabold text-foreground shadow-sm hover:border-slate-350 dark:hover:border-slate-700 transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Price details, quick specs, and publisher contacts */}
        <div className="space-y-6 lg:sticky lg:top-28">
          {/* Quick Price card */}
          <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-md space-y-4">
            <div>
              <p className="text-xxs font-extrabold text-muted uppercase tracking-widest">Monthly Rent</p>
              <p className="text-2xl font-black text-primary mt-1">
                BDT {listing.price.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted font-bold mt-1">
                Security deposit requirements depend on owner terms.
              </p>
            </div>

            {/* Spec grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold text-muted border-t border-card-border pt-4">
              <div className="flex flex-col items-center gap-1 border-r border-card-border">
                <Bed className="h-4.5 w-4.5 text-primary" />
                <span>{listing.bedrooms} Beds</span>
              </div>
              <div className="flex flex-col items-center gap-1 border-r border-card-border">
                <Bath className="h-4.5 w-4.5 text-primary" />
                <span>{listing.bathrooms} Baths</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Maximize className="h-4.5 w-4.5 text-primary" />
                <span>{listing.sizeSqft} Sqft</span>
              </div>
            </div>
          </div>

          {/* Rules / Features status card */}
          <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-xs font-black text-foreground uppercase tracking-wider pb-2 border-b border-card-border">
              Quick Highlights
            </h3>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-muted">
                  <ParkingCircle className="h-4.5 w-4.5 text-primary" />
                  <span>Parking Slot</span>
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    listing.parkingAvailable
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-450"
                  }`}
                >
                  {listing.parkingAvailable ? "Available" : "Not Available"}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-muted">
                  <Cat className="h-4.5 w-4.5 text-primary" />
                  <span>Pet Friendly</span>
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    listing.petsAllowed
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-450"
                  }`}
                >
                  {listing.petsAllowed ? "Allowed" : "Not Allowed"}
                </span>
              </div>
            </div>
          </div>

          {/* Lease file document downloader */}
          {listing.leaseDocumentUrl && (
            <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-sm space-y-3.5">
              <h3 className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="h-4.5 w-4.5 text-primary" />
                <span>Lease Contract Agreement</span>
              </h3>
              <p className="text-[10px] text-muted font-bold leading-relaxed">
                The publisher provided a sample or official lease agreement template for review.
              </p>
              <a
                href={listing.leaseDocumentUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-primary/25 hover:border-primary text-xs font-extrabold text-primary hover:bg-primary/5 transition-all cursor-pointer text-center"
              >
                <span>View Lease Document</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}

          {/* Contact Details Card */}
          <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-xs font-black text-foreground uppercase tracking-wider pb-2 border-b border-card-border flex items-center gap-1.5">
              <User className="h-4.5 w-4.5 text-primary" />
              <span>Contact Publisher</span>
            </h3>
            <div className="space-y-3 text-xs font-bold">
              {listing.user?.name && (
                <div className="space-y-1">
                  <span className="text-[10px] text-muted uppercase tracking-wider font-extrabold">Name</span>
                  <p className="text-foreground text-sm font-extrabold">{listing.user.name}</p>
                </div>
              )}
              <div className="space-y-1">
                <span className="text-[10px] text-muted uppercase tracking-wider font-extrabold">Email Address</span>
                <a
                  href={`mailto:${listing.addedBy || listing.user?.email}`}
                  className="flex items-center gap-1.5 text-primary hover:underline font-extrabold text-sm"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>{listing.addedBy || listing.user?.email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
