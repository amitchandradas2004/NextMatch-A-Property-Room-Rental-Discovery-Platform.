"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "./theme-provider";
import { Sun, Moon, Menu, X, Sparkles, ChevronDown, User, LogOut, Home, Building, PlusCircle, LayoutDashboard, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const {
    data: session,
    isPending,
  } = authClient.useSession();
  const user = session?.user;

  // Unified logout action
  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully");
            router.refresh();
          }
        }
      });
    } catch {
      toast.error("Failed to log out");
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  // Dynamic links list based on authentication state
  const navLinks = user
    ? [
      { name: "Home", href: "/" },
      { name: "Apartments", href: "/apartments" },
      { name: "Add Listing", href: "/items/add" },
      { name: "Manage Listings", href: "/items/manage" },
      { name: "Saved", href: "/saved" },
      { name: "Profile", href: "/profile" },
    ]
    : [
      { name: "Home", href: "/" },
      { name: "Apartments", href: "/apartments" },
      { name: "About", href: "/about" },
    ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-background/80 dark:bg-background/80 backdrop-blur-md shadow-md border-b border-card-border py-3"
        : "bg-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                NextMatch
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {isPending ? (
              <div className="flex items-center gap-8 animate-pulse">
                <div className="h-4 w-12 bg-card-border rounded-md" />
                <div className="h-4 w-20 bg-card-border rounded-md" />
                <div className="h-4 w-14 bg-card-border rounded-md" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={user ? "logged-in" : "logged-out"}
                  initial={{ opacity: 0, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 2 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-8"
                >
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`text-sm font-semibold transition-all relative group py-2 ${pathname === link.href
                        ? "text-primary font-bold animate-pulse-slow"
                        : "text-foreground/80 hover:text-primary"
                        }`}
                    >
                      {link.name}
                      <span
                        className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                          }`}
                      />
                    </Link>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </nav>

          {/* Right actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-card-border text-foreground/80 hover:text-primary transition-all active:scale-95 cursor-pointer"
              aria-label="Toggle Dark/Light Mode"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: -20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5 text-accent" />
                  ) : (
                    <Moon className="h-5 w-5 text-primary" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>

            {isPending ? (
              <div className="flex items-center gap-4 animate-pulse">
                <div className="h-8 w-14 bg-card-border rounded-lg" />
                <div className="h-10 w-28 bg-card-border rounded-xl" />
              </div>
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-1.5 py-1 rounded-full border border-card-border bg-card-bg/50 hover:bg-card-bg hover:border-primary/50 transition-all select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold overflow-hidden">
                    {user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <span>{user.name ? user.name[0].toUpperCase() : "U"}</span>
                    )}
                  </div>
                  <span className="hidden lg:block text-xs font-bold text-foreground/90 max-w-[80px] truncate pr-1">
                    {user.name}
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 text-muted transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2.5 w-60 rounded-2xl bg-card-bg border border-card-border shadow-xl py-2 z-50 origin-top-right text-foreground"
                    >
                      <div className="px-4 py-3 border-b border-card-border">
                        <p className="text-sm font-extrabold truncate text-foreground">{user.name}</p>
                        <p className="text-xs text-muted truncate mt-0.5">{user.email}</p>
                      </div>

                      <div className="p-1.5 space-y-0.5">
                        <Link
                          href="/"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm font-semibold hover:bg-card-border hover:text-primary rounded-xl transition-colors"
                        >
                          <Home className="h-4 w-4 text-muted" />
                          <span>Home</span>
                        </Link>
                        <Link
                          href="/apartments"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm font-semibold hover:bg-card-border hover:text-primary rounded-xl transition-colors"
                        >
                          <Building className="h-4 w-4 text-muted" />
                          <span>Apartments</span>
                        </Link>
                        <Link
                          href="/items/add"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm font-semibold hover:bg-card-border hover:text-primary rounded-xl transition-colors"
                        >
                          <PlusCircle className="h-4 w-4 text-secondary" />
                          <span>Add Listing</span>
                        </Link>
                        <Link
                          href="/items/manage"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm font-semibold hover:bg-card-border hover:text-primary rounded-xl transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 text-muted" />
                          <span>Manage Listings</span>
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm font-semibold hover:bg-card-border hover:text-primary rounded-xl transition-colors"
                        >
                          <User className="h-4 w-4 text-primary" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          href="/saved"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm font-semibold hover:bg-card-border hover:text-primary rounded-xl transition-colors"
                        >
                          <Bookmark className="h-4 w-4 text-muted" />
                          <span>Saved Apartments</span>
                        </Link>
                        <div className="h-px bg-card-border my-1" />
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm font-semibold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="h-4 w-4 text-rose-500" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold hover:text-primary transition-colors cursor-pointer select-none"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold bg-primary text-white hover:bg-primary-hover rounded-xl shadow-md shadow-primary/10 transition-all hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer select-none"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Hamburger / Toggle Mobile menu */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Theme Toggle (Mobile Header) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-card-border text-foreground/85 active:scale-95 transition-all cursor-pointer"
              aria-label="Toggle Dark/Light Mode"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-accent" />
              ) : (
                <Moon className="h-5 w-5 text-primary" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-card-border text-foreground/80 transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-background border-b border-card-border overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {isPending ? (
                <div className="space-y-4 py-2 px-3 animate-pulse">
                  <div className="h-5 w-24 bg-card-border rounded-lg" />
                  <div className="h-5 w-32 bg-card-border rounded-lg" />
                  <div className="h-5 w-28 bg-card-border rounded-lg" />
                </div>
              ) : (
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-bold transition-all ${pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-card-border hover:text-primary text-foreground/80"
                        }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}

              <div className="h-px bg-card-border my-2" />
              <div className="flex flex-col gap-2 pt-2 px-3">
                {isPending ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-12 w-full bg-card-border rounded-xl" />
                    <div className="h-12 w-full bg-card-border rounded-xl" />
                  </div>
                ) : user ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-card-border/30">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold overflow-hidden">
                        {user.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                          <span>{user.name ? user.name[0].toUpperCase() : "U"}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-extrabold text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted truncate mt-0.5">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full py-3.5 text-center text-sm font-bold bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-xl transition-all select-none cursor-pointer flex items-center justify-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 text-center text-sm font-bold hover:bg-card-border rounded-xl transition-all select-none cursor-pointer"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 text-center text-sm font-bold bg-primary text-white hover:bg-primary-hover rounded-xl shadow-md transition-all select-none cursor-pointer"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
