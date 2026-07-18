"use client";

import React from "react";
import { Sparkles, FileText, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AIHighlight() {
  return (
    <section id="ai-features" className="py-24 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden border-b border-slate-800">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/20 blur-[120px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-semibold uppercase tracking-wider mb-4 border border-white/5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>NextMatch Intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">AI Agents Built For Renters</h2>
          <p className="text-slate-350 mt-4 text-base leading-relaxed">
            Eliminate rental anxiety. Our intelligent assistants scan listings for your perfect match and summarize lease terms to keep you protected.
          </p>
        </div>

        {/* Features Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Card 1: Recommendation Engine */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/40 backdrop-blur-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white mb-6 shadow-lg shadow-primary/25">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Smart Recommendation Engine</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Tell the AI exactly what {"you're"} looking for in natural language. It understands complex commute requirements, local vibes, and amenities.
              </p>

              {/* Chat Mockup */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-xs font-mono space-y-3 mb-8">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white flex-shrink-0">
                    U
                  </div>
                  <div className="p-2.5 rounded-2xl rounded-tl-none bg-slate-800 text-slate-300 max-w-[85%]">
                    &quot;Find a quiet studio near tech offices with a gym under $2k&quot;
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-white flex-shrink-0 shadow-sm shadow-primary/30">
                    AI
                  </div>
                  <div className="p-2.5 rounded-2xl rounded-tl-none bg-primary/10 border border-primary/20 text-indigo-200 max-w-[85%]">
                    &quot;Analyzing... Located 2 studios matching: <b>Capitol Loft</b> (12 min commute, Gym included, $1,800/mo). Quiet rating: 4.8/5.&quot;
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert("Smart Recommendation Engine detail view")}
              className="group self-start flex items-center gap-1 text-sm font-semibold text-primary hover:text-indigo-300 transition-colors"
            >
              <span>Try Smart Discovery</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>

          {/* Card 2: Lease Summarizer */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-secondary/40 backdrop-blur-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-white mb-6 shadow-lg shadow-secondary/25">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3">AI Lease Document Summarizer</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Upload any PDF lease. Our legal summarizer scans paragraphs to extract critical terms, late fee schedules, and flag red-flag clauses.
              </p>

              {/* Lease Summarizer Mockup */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-xs font-mono space-y-3 mb-8">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lease_Agreement_Final.pdf</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-semibold">Analyzed</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-slate-300">
                    <ShieldCheck className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                    <span><b>Rent Due:</b> 1st of month. Grace period: 3 days.</span>
                  </div>
                  <div className="flex items-start gap-2 text-amber-200">
                    <HelpCircle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span><b>Late Fee:</b> $150 penalty after day 5 (industry high).</span>
                  </div>
                  <div className="flex items-start gap-2 text-rose-350">
                    <div className="h-4 w-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">!</div>
                    <span><b>Notice Period:</b> 60 days before termination.</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert("AI Lease Summarizer detail view")}
              className="group self-start flex items-center gap-1 text-sm font-semibold text-secondary hover:text-teal-300 transition-colors"
            >
              <span>Summarize Your Lease</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
