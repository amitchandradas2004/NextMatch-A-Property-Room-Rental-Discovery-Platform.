"use client";

import React, { useState } from "react";
import { Send, ChevronDown, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does the AI Matching Engine work?",
    answer: "Our engine uses advanced natural language processing. Instead of check-boxes, you write what you need (e.g., 'quiet garden studio 15 mins from university with a gym'). The agent parses commute zones, vibes, and specs to deliver personalized matching scores.",
  },
  {
    question: "Is the AI Lease Summarizer safe and secure?",
    answer: "Yes, security is our top priority. All lease agreements uploaded to NestMatch are encrypted, processed in sandbox memory, and redacted of sensitive identifiers. We never sell your lease data or use it for marketing.",
  },
  {
    question: "Is listing and applying for rooms free?",
    answer: "Browsing, matching, and messaging hosts are 100% free for renters. Landlords and hosts can list up to 3 properties for free, with premium upgrades available for boost placement or advanced verification badges.",
  },
  {
    question: "How does host verification work?",
    answer: "To combat rental scams, we require all hosts to upload government ID and proof of property ownership. Verified listings are marked with a shield icon, indicating they have passed document checks.",
  },
];

export default function NewsletterFAQ() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 3000);
  };

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-neutral-bg border-b border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Newsletter Column (Left - 5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Stay Updated</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-muted text-sm leading-relaxed">
              Get the latest properties in your city, guides on renting safety, and updates on our AI tools. No spam, unsubscribe anytime.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={subscribed}
                  required
                  className="w-full px-5 py-3.5 rounded-xl border border-card-border bg-card-bg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm pr-12"
                />
                <button
                  type="submit"
                  disabled={subscribed}
                  className="absolute right-2 top-2 p-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors disabled:bg-emerald-600"
                  aria-label="Subscribe"
                >
                  {subscribed ? <Check className="h-4.5 w-4.5" /> : <Send className="h-4.5 w-4.5" />}
                </button>
              </div>
              <AnimatePresence>
                {subscribed && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-emerald-600 dark:text-emerald-400 font-bold"
                  >
                    Success! You have subscribed to the newsletter.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* FAQ Accordion Column (Right - 7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-2xl font-bold tracking-tight text-foreground mb-6">
              Frequently Asked Questions
            </h3>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isExpanded = expandedIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-card-border bg-card-bg overflow-hidden shadow-sm transition-all"
                  >
                    <button
                      onClick={() => toggleFAQ(idx)}
                      className="w-full flex items-center justify-between p-5 text-left font-bold text-foreground text-sm sm:text-base hover:bg-neutral-bg transition-colors"
                      aria-expanded={isExpanded}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`h-5 w-5 text-muted transition-transform duration-300 ${
                          isExpanded ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <div className="p-5 pt-0 text-sm text-muted leading-relaxed border-t border-card-border/50">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
