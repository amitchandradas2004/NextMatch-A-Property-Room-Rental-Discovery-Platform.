"use client";

import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-md mx-auto px-4 py-24 sm:py-32 select-none">
      <div className="bg-card-bg border border-card-border rounded-2xl shadow-sm p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}
