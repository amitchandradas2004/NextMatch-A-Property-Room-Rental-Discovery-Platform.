"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FileText,
  DollarSign,
  MapPin,
  Home,
  Calendar,
  Sparkles,
  Plus,
  Image as ImageIcon,
  Trash2,
  Loader2,
  FileCheck,
  Check
} from "lucide-react";
import { authClient } from "../../../lib/auth-client";
import toast from "react-hot-toast";

import AuthInput from "../../../components/auth-input";

// Schema definitions
const listingFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  shortDescription: z
    .string()
    .min(20, "Short description must be at least 20 characters")
    .max(150, "Short description cannot exceed 150 characters"),
  fullDescription: z.string().min(50, "Full description must be at least 50 characters"),
  price: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ message: "Price is required" }).positive("Price must be a positive number")
  ),
  propertyType: z.enum(["apartment", "studio", "house", "room"], {
    message: "Property type is required",
  }),
  location: z.object({
    city: z.string().min(1, "City is required"),
    address: z.string().min(1, "Address is required"),
    nearbyLandmark: z.string().optional(),
  }),
  bedrooms: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ message: "Bedrooms count is required" }).min(0, "Bedrooms cannot be negative")
  ),
  bathrooms: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ message: "Bathrooms count is required" }).min(0, "Bathrooms cannot be negative")
  ),
  sizeSqft: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ message: "Size is required" }).positive("Size must be positive")
  ),
  floorNumber: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number().min(0, "Floor number cannot be negative").optional()
  ),
  totalFloors: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number().min(0, "Total floors cannot be negative").optional()
  ),
  furnished: z.enum(["furnished", "semi-furnished", "unfurnished"], {
    message: "Furnished status is required",
  }),
  parkingAvailable: z.boolean().default(false),
  petsAllowed: z.boolean().default(false),
  availableFrom: z
    .string()
    .min(1, "Availability date is required")
    .refine((val) => {
      const selected = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, "Available date cannot be in the past"),
  minLeaseTerm: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number().min(1, "Lease term must be at least 1 month").optional()
  ),
  amenities: z.array(z.string()).default([]),
  images: z
    .array(
      z.object({
        url: z.string().url("Invalid image URL").min(1, "Image URL is required"),
      })
    )
    .min(1, "At least one image URL is required"),
  leaseDocumentUrl: z.string().url("Invalid document URL").optional().or(z.literal("")),
});

interface ListingFormValues {
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: string | number;
  propertyType: "apartment" | "studio" | "house" | "room";
  location: {
    city: string;
    address: string;
    nearbyLandmark?: string;
  };
  bedrooms: string | number;
  bathrooms: string | number;
  sizeSqft: string | number;
  floorNumber?: string | number;
  totalFloors?: string | number;
  furnished: "furnished" | "semi-furnished" | "unfurnished";
  parkingAvailable: boolean;
  petsAllowed: boolean;
  availableFrom: string;
  minLeaseTerm?: string | number;
  amenities: string[];
  images: { url: string }[];
  leaseDocumentUrl?: string;
}

const AMENITY_OPTIONS = [
  "Elevator",
  "Generator Backup",
  "Gas Line",
  "Balcony",
  "Security Guard",
  "Rooftop Access",
  "24/7 Water Supply",
  "CCTV",
  "Gym",
  "Swimming Pool",
  "Air Conditioning",
  "Internet/WiFi",
];

export default function AddApartmentPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Route protection redirect
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema) as unknown as Resolver<ListingFormValues, object>,
    defaultValues: {
      title: "",
      shortDescription: "",
      fullDescription: "",
      propertyType: "apartment",
      location: { city: "", address: "", nearbyLandmark: "" },
      furnished: "unfurnished",
      parkingAvailable: false,
      petsAllowed: false,
      availableFrom: "",
      amenities: [],
      images: [{ url: "" }],
      leaseDocumentUrl: "",
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  const shortDescVal = watch("shortDescription") || "";

  const onSubmit = async (data: ListingFormValues) => {
    try {
      const payload = {
        ...data,
        addedBy: session?.user?.email,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Failed to create listing.");
      }

      toast.success("Listing published successfully!");
      router.push("/items/manage");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to publish listing.");
    }
  };

  // Full-page Loading Skeleton
  if (isPending || !session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 sm:py-32 space-y-8 animate-pulse select-none">
        <div className="space-y-3 pb-8 border-b border-card-border">
          <div className="h-8 w-64 bg-card-border rounded" />
          <div className="h-4 w-96 bg-card-border rounded" />
        </div>
        <div className="space-y-6">
          <div className="h-48 bg-card-bg border border-card-border rounded-2xl" />
          <div className="h-32 bg-card-bg border border-card-border rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-24 sm:py-32 space-y-8 text-foreground select-none">
      <div className="pb-8 border-b border-card-border">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Add New Apartment</h1>
        <p className="text-sm text-muted font-semibold mt-1.5">
          List your home space details to start finding match candidates.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* SECTION 1: BASIC INFORMATION */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Basic Information</h2>
              <p className="text-xs text-muted font-bold">Primary descriptions and headlines</p>
            </div>
          </div>

          <div className="space-y-4">
            <AuthInput
              id="title"
              label="Listing Title"
              placeholder="Spacious Duplex Near Metro Hub"
              error={errors.title?.message}
              {...register("title")}
            />

            <div className="space-y-1.5 w-full text-left">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="shortDescription"
                  className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                >
                  Short Description
                </label>
                <span
                  className={`text-[10px] font-extrabold ${shortDescVal.length > 150 ? "text-rose-500" : "text-muted"
                    }`}
                >
                  {shortDescVal.length}/150
                </span>
              </div>
              <input
                id="shortDescription"
                type="text"
                placeholder="Brief summary sentence that shows in searches..."
                className={`w-full py-3 px-4 rounded-xl border ${errors.shortDescription
                  ? "border-rose-500/50 bg-rose-500/5 dark:bg-rose-950/10 focus:ring-rose-500/20 focus:border-rose-500 text-rose-600 dark:text-rose-450"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 focus:ring-primary/10 dark:focus:ring-primary/15 focus:border-primary text-slate-900 dark:text-slate-100"
                  } placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 transition-all duration-200 text-sm font-semibold`}
                {...register("shortDescription")}
              />
              {errors.shortDescription?.message && (
                <p className="text-xs text-rose-600 dark:text-rose-450 font-bold mt-1">
                  {errors.shortDescription.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5 w-full text-left">
              <label
                htmlFor="fullDescription"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
              >
                Full Description
              </label>
              <textarea
                id="fullDescription"
                rows={5}
                placeholder="Give detailed specifications about size details, locations, views, rules..."
                className={`w-full py-3 px-4 rounded-xl border min-h-[120px] ${errors.fullDescription
                  ? "border-rose-500/50 bg-rose-500/5 dark:bg-rose-950/10 focus:ring-rose-500/20 focus:border-rose-500 text-rose-600 dark:text-rose-450"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 focus:ring-primary/10 dark:focus:ring-primary/15 focus:border-primary text-slate-900 dark:text-slate-100"
                  } placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 transition-all duration-200 text-sm font-semibold`}
                {...register("fullDescription")}
              />
              {errors.fullDescription?.message && (
                <p className="text-xs text-rose-600 dark:text-rose-450 font-bold mt-1">
                  {errors.fullDescription.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 2: PRICING & TYPE */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Pricing & Property Type</h2>
              <p className="text-xs text-muted font-bold">Rates details and property formats</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AuthInput
              id="price"
              label="Price (monthly / BDT)"
              type="number"
              placeholder="35000"
              error={errors.price?.message}
              {...register("price")}
            />

            <div className="space-y-1.5 w-full text-left">
              <label
                htmlFor="propertyType"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
              >
                Property Type
              </label>
              <select
                id="propertyType"
                className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 focus:ring-primary/10 dark:focus:ring-primary/15 focus:border-primary text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-200 text-sm font-semibold cursor-pointer"
                {...register("propertyType")}
              >
                <option value="apartment">Apartment</option>
                <option value="studio">Studio</option>
                <option value="house">House</option>
                <option value="room">Shared Room</option>
              </select>
              {errors.propertyType?.message && (
                <p className="text-xs text-rose-600 dark:text-rose-450 font-bold mt-1">
                  {errors.propertyType.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 3: LOCATION */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Location Details</h2>
              <p className="text-xs text-muted font-bold">Address location fields</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthInput
                id="location.city"
                label="City"
                placeholder="Dhaka"
                error={errors.location?.city?.message}
                {...register("location.city")}
              />
              <AuthInput
                id="location.nearbyLandmark"
                label="Nearby Landmark (Optional)"
                placeholder="Near Jamuna Future Park"
                error={errors.location?.nearbyLandmark?.message}
                {...register("location.nearbyLandmark")}
              />
            </div>
            <AuthInput
              id="location.address"
              label="Full Address"
              placeholder="Flat 4B, House 12, Road 5, Bashundhara R/A"
              error={errors.location?.address?.message}
              {...register("location.address")}
            />
          </div>
        </section>

        {/* SECTION 4: SPECIFICATIONS */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Specifications</h2>
              <p className="text-xs text-muted font-bold">Property size and interior counts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <AuthInput
              id="bedrooms"
              label="Bedrooms"
              type="number"
              placeholder="3"
              error={errors.bedrooms?.message}
              {...register("bedrooms")}
            />
            <AuthInput
              id="bathrooms"
              label="Bathrooms"
              type="number"
              placeholder="2"
              error={errors.bathrooms?.message}
              {...register("bathrooms")}
            />
            <AuthInput
              id="sizeSqft"
              label="Size (Sqft)"
              type="number"
              placeholder="1250"
              error={errors.sizeSqft?.message}
              {...register("sizeSqft")}
            />
            <AuthInput
              id="floorNumber"
              label="Floor Number (Optional)"
              type="number"
              placeholder="4"
              error={errors.floorNumber?.message}
              {...register("floorNumber")}
            />
            <AuthInput
              id="totalFloors"
              label="Total Floors (Optional)"
              type="number"
              placeholder="8"
              error={errors.totalFloors?.message}
              {...register("totalFloors")}
            />
            <div className="space-y-1.5 w-full text-left">
              <label
                htmlFor="furnished"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
              >
                Furnished Status
              </label>
              <select
                id="furnished"
                className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 focus:ring-primary/10 dark:focus:ring-primary/15 focus:border-primary text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-200 text-sm font-semibold cursor-pointer"
                {...register("furnished")}
              >
                <option value="unfurnished">Unfurnished</option>
                <option value="semi-furnished">Semi-furnished</option>
                <option value="furnished">Furnished</option>
              </select>
              {errors.furnished?.message && (
                <p className="text-xs text-rose-600 dark:text-rose-450 font-bold mt-1">
                  {errors.furnished.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 5: AVAILABILITY & LEASE */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Availability & Lease</h2>
              <p className="text-xs text-muted font-bold">Calendar availability and contract terms</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 w-full text-left">
              <label
                htmlFor="availableFrom"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
              >
                Available From
              </label>
              <input
                id="availableFrom"
                type="date"
                className={`w-full py-3 px-4 rounded-xl border ${errors.availableFrom
                  ? "border-rose-500/50 bg-rose-500/5 dark:bg-rose-950/10 focus:ring-rose-500/20 focus:border-rose-500 text-rose-600 dark:text-rose-450"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 focus:ring-primary/10 dark:focus:ring-primary/15 focus:border-primary text-slate-900 dark:text-slate-100"
                  } focus:outline-none focus:ring-4 transition-all duration-200 text-sm font-semibold cursor-pointer`}
                {...register("availableFrom")}
              />
              {errors.availableFrom?.message && (
                <p className="text-xs text-rose-600 dark:text-rose-450 font-bold mt-1">
                  {errors.availableFrom.message}
                </p>
              )}
            </div>

            <AuthInput
              id="minLeaseTerm"
              label="Minimum Lease Term (Months, Optional)"
              type="number"
              placeholder="6"
              error={errors.minLeaseTerm?.message}
              {...register("minLeaseTerm")}
            />
          </div>
        </section>

        {/* SECTION 6: AMENITIES */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Amenities</h2>
              <p className="text-xs text-muted font-bold">Check utilities and common items available</p>
            </div>
          </div>

          <Controller
            control={control}
            name="amenities"
            render={({ field }) => (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {AMENITY_OPTIONS.map((option) => {
                  const selected = field.value?.includes(option);
                  return (
                    <button
                      type="button"
                      key={option}
                      onClick={() => {
                        const nextValue = selected
                          ? field.value.filter((x: string) => x !== option)
                          : [...(field.value || []), option];
                        field.onChange(nextValue);
                      }}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-bold transition-all select-none cursor-pointer ${selected
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 hover:border-slate-350 dark:hover:border-slate-700 text-foreground"
                        }`}
                    >
                      <div
                        className={`h-4.5 w-4.5 rounded flex items-center justify-center border transition-all ${selected
                          ? "bg-primary border-primary text-white"
                          : "border-slate-300 dark:border-slate-600"
                          }`}
                      >
                        {selected && <Check className="h-3 w-3" />}
                      </div>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
            )}
          />
        </section>

        {/* SECTION 7: EXTRAS */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Extras</h2>
              <p className="text-xs text-muted font-bold">Extra listing properties</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <Controller
              control={control}
              name="parkingAvailable"
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={`flex-1 flex items-center justify-between p-4 rounded-xl border select-none cursor-pointer transition-all ${field.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-card-border hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                >
                  <div className="text-left">
                    <p className="text-sm font-extrabold text-foreground">Parking Available</p>
                    <p className="text-xxs text-muted font-bold mt-0.5">Assigned car slot included</p>
                  </div>
                  <div
                    className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-all ${field.value ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
                      }`}
                  >
                    <div
                      className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-250 ${field.value ? "translate-x-5" : "translate-x-0"
                        }`}
                    />
                  </div>
                </button>
              )}
            />

            <Controller
              control={control}
              name="petsAllowed"
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={`flex-1 flex items-center justify-between p-4 rounded-xl border select-none cursor-pointer transition-all ${field.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-card-border hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                >
                  <div className="text-left">
                    <p className="text-sm font-extrabold text-foreground">Pets Allowed</p>
                    <p className="text-xxs text-muted font-bold mt-0.5">Allows cats, dogs, or small birds</p>
                  </div>
                  <div
                    className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-all ${field.value ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
                      }`}
                  >
                    <div
                      className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-250 ${field.value ? "translate-x-5" : "translate-x-0"
                        }`}
                    />
                  </div>
                </button>
              )}
            />
          </div>
        </section>

        {/* SECTION 8: MEDIA */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Media & Documents</h2>
              <p className="text-xs text-muted font-bold">Image URLs and lease draft contracts</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Property Images (URLs, Min 1 Required)
                </label>
                <button
                  type="button"
                  onClick={() => append({ url: "" })}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 border border-primary/20 hover:border-primary/45 rounded-xl transition-all cursor-pointer"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span>Add URL</span>
                </button>
              </div>

              {fields.map((field, index) => {
                const imgUrl = watch(`images.${index}.url`);
                return (
                  <div key={field.id} className="flex gap-3 items-start">
                    {/* Live Preview Card */}
                    <div className="h-12 w-12 rounded-xl border border-card-border bg-slate-100 dark:bg-slate-900/60 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {imgUrl && imgUrl.startsWith("http") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imgUrl}
                          alt="Thumbnail Preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-slate-400" />
                      )}
                    </div>

                    <div className="flex-grow">
                      <AuthInput
                        id={`images.${index}.url`}
                        label=""
                        placeholder="https://example.com/listings-image-1.jpg"
                        error={errors.images?.[index]?.url?.message}
                        {...register(`images.${index}.url`)}
                      />
                    </div>

                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-3 text-rose-500 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/35 rounded-xl transition-colors mt-0.5 cursor-pointer"
                        title="Remove Image row"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    )}
                  </div>
                );
              })}
              {errors.images?.root?.message && (
                <p className="text-xs text-rose-600 dark:text-rose-450 font-bold">
                  {errors.images.root.message}
                </p>
              )}
            </div>

            <div className="h-px bg-card-border my-6" />

            <AuthInput
              id="leaseDocumentUrl"
              label="Lease Agreement Draft URL (Optional)"
              placeholder="https://example.com/lease-draft-agreement.pdf"
              icon={FileCheck}
              error={errors.leaseDocumentUrl?.message}
              {...register("leaseDocumentUrl")}
            />
          </div>
        </section>

        {/* SECTION 9: SUBMIT ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-grow py-3.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-extrabold text-sm uppercase tracking-wider rounded-xl transition-all shadow-md shadow-primary/10 hover:shadow-primary/25 cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
            <span>Publish Property Listing</span>
          </button>
        </div>
      </form>
    </div>
  );
}
