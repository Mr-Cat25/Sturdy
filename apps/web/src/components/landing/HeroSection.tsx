"use client";


import { motion } from "framer-motion";


function ScriptCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg ring-1 ring-[#EEF2F7]"
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-[#5B8DEF]">
        Example Script
      </p>


      <h3 className="mt-3 text-lg font-semibold text-[#1E2430]">
        Situation: Leaving the park
      </h3>


      <div className="mt-5 space-y-4">
        <div className="rounded-xl bg-[#F7F9FC] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#5B8DEF]">
            Regulate
          </p>
          <p className="mt-1 text-base leading-relaxed text-[#1E2430]">
            &ldquo;I&rsquo;m here. I won&rsquo;t let you hit.&rdquo;
          </p>
        </div>


        <div className="rounded-xl bg-[#F7F9FC] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6FCF97]">
            Connect
          </p>
          <p className="mt-1 text-base leading-relaxed text-[#1E2430]">
            &ldquo;You really wanted to stay.&rdquo;
          </p>
        </div>


        <div className="rounded-xl bg-[#F7F9FC] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#D9A441]">
            Guide
          </p>
          <p className="mt-1 text-base leading-relaxed text-[#1E2430]">
            &ldquo;We are leaving now. Hold my hand.&rdquo;
          </p>
        </div>
      </div>
    </motion.div>
  );
}


function VisualPlaceholder() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
      className="h-56 w-full max-w-md overflow-hidden rounded-2xl shadow-sm ring-1 ring-white/60"
      aria-hidden="true"
    >
      <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(91,141,239,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(111,207,151,0.16),_transparent_30%),linear-gradient(135deg,#EEF2F7,#DFE7F0)]">
        <div className="rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm font-medium text-[#4B5563] shadow-sm">
          Calm parent + child image
        </div>
      </div>
    </motion.div>
  );
}


export default function HeroSection() {
  return (
    <section
      id="start"
      className="relative overflow-hidden bg-[#F7F9FC] px-6 pb-24 pt-24 sm:px-8 lg:px-12 lg:pt-28"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-4xl font-bold leading-tight tracking-tight text-[#1E2430] sm:text-5xl lg:text-6xl"
          >
            What should I say
            <br />
            right now?
          </motion.h1>


          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="mt-5 max-w-md text-lg leading-relaxed text-[#4B5563] sm:text-xl"
          >
            Calm scripts for hard parenting moments.
          </motion.p>


          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:items-start"
          >
            <a
              href="#pricing"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-[#5B8DEF] px-7 text-base font-semibold text-white shadow-md transition-colors hover:bg-[#4a7de0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF] focus-visible:ring-offset-2"
            >
              Start Free
            </a>


            <a
              href="#how-it-works"
              className="inline-flex h-12 items-center justify-center text-base font-medium text-[#5B8DEF] transition-colors hover:text-[#4a7de0]"
            >
              See How It Works &rarr;
            </a>
          </motion.div>


          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
            className="mt-5 text-sm text-[#4B5563]"
          >
            Free plan available &bull; No credit card required
          </motion.p>
        </div>


        <div className="flex flex-col items-center gap-8">
          <VisualPlaceholder />
          <ScriptCard />
        </div>
      </div>
    </section>
  );
}

