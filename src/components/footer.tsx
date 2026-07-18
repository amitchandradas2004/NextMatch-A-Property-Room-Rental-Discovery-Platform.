"use client";

import React from "react";
import { Sparkles, Twitter, Instagram, Linkedin, Facebook, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.getElementById(href.substring(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-card-bg border-t border-card-border text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-4 space-y-6">
            <a href="#" onClick={(e) => handleLinkClick(e, "#")} className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                NextMatch
              </span>
            </a>
            <p className="text-sm text-muted leading-relaxed max-w-sm">
              Discover your perfect rental using advanced matching filters and AI tools. Get your lease terms clarified instantly before signing.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-card-border hover:border-primary/45 hover:text-primary transition-all text-muted"
                aria-label="Follow NextMatch on Twitter"
              >
                <Twitter className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-card-border hover:border-primary/45 hover:text-primary transition-all text-muted"
                aria-label="Follow NextMatch on Instagram"
              >
                <Instagram className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-card-border hover:border-primary/45 hover:text-primary transition-all text-muted"
                aria-label="Follow NextMatch on LinkedIn"
              >
                <Linkedin className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-card-border hover:border-primary/45 hover:text-primary transition-all text-muted"
                aria-label="Follow NextMatch on Facebook"
              >
                <Facebook className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <span className="block text-sm font-bold uppercase tracking-wider text-muted">
              Quick Links
            </span>
            <ul className="space-y-3">
              <li>
                <a
                  href="#featured"
                  onClick={(e) => handleLinkClick(e, "#featured")}
                  className="text-sm font-semibold hover:text-primary transition-colors text-muted"
                >
                  Explore Rooms
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleLinkClick(e, "#how-it-works")}
                  className="text-sm font-semibold hover:text-primary transition-colors text-muted"
                >
                  How it Works
                </a>
              </li>
              <li>
                <a
                  href="#categories"
                  onClick={(e) => handleLinkClick(e, "#categories")}
                  className="text-sm font-semibold hover:text-primary transition-colors text-muted"
                >
                  Browse Layouts
                </a>
              </li>
              <li>
                <a
                  href="#ai-features"
                  onClick={(e) => handleLinkClick(e, "#ai-features")}
                  className="text-sm font-semibold hover:text-primary transition-colors text-muted"
                >
                  AI Agents
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <span className="block text-sm font-bold uppercase tracking-wider text-muted">
              Support & Legal
            </span>
            <ul className="space-y-3">
              <li>
                <a
                  href="/about"
                  className="text-sm font-semibold hover:text-primary transition-colors text-muted"
                >
                  About Our Team
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-sm font-semibold hover:text-primary transition-colors text-muted"
                >
                  Contact Helpdesk
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-sm font-semibold hover:text-primary transition-colors text-muted"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-sm font-semibold hover:text-primary transition-colors text-muted"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <span className="block text-sm font-bold uppercase tracking-wider text-muted">
              Get in Touch
            </span>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex items-start gap-2.5">
                <Mail className="h-4.5 w-4.5 text-primary flex-shrink-0 mt-0.5" />
                <span>support@nextmatch.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-4.5 w-4.5 text-primary flex-shrink-0 mt-0.5" />
                <span>+1 (800) 555-NEXT</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-primary flex-shrink-0 mt-0.5" />
                <span>100 Pine Street, Suite 400<br />San Francisco, CA 94111</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-px bg-card-border mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted font-medium">
          <span>&copy; {currentYear} NextMatch Technologies Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-primary transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-primary transition-colors">Terms</a>
            <a href="/cookies" className="hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
