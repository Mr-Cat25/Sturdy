"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: "easeOut" },
  }),
};

function StepCard({
  index,
  title,
  description,
  children,
}: {
  index: number;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="flex flex-col rounded-2xl bg-white p-6 shadow-md ring-1 ring-[#EEF2F7]"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[#5B8DEF]">
        Step {index + 1}
      </p>
      <h3 className="mt-2 text-lg font-semibold text-[#1E2430]">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-[#4B5563]">
        {description}
      </p>
      <div className="mt-5 flex-1">{children}</div>
    </motion.div>
  );
}

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="bg-[#EEF2F7] px-6 py-24 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-[#1E2430] sm:text-4xl">
            Support in three simple steps
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-[#4B5563] sm:text-lg">
            Sturdy helps you find calm words during difficult parenting moments.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {/* Step 1 */}
          <StepCard
            index={0}
            title="Describe the moment"
            description="Tell Sturdy what's happening."
          >
            <div className="rounded-xl bg-[#F7F9FC] px-4 py-3">
              <p className="text-sm italic leading-relaxed text-[#4B5563]">
                &ldquo;My child is screaming because we have to leave the
                park.&rdquo;
              </p>
            </div>
          </StepCard>

          {/* Step 2 */}
          <StepCard
            index={1}
            title="Get a calm script"
            description="Sturdy generates simple words you can say immediately."
          >
            <div className="space-y-3">
              <div className="rounded-xl bg-[#F7F9FC] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#5B8DEF]">
                  Regulate
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[#1E2430]">
                  &ldquo;I&rsquo;m here. I won&rsquo;t let you hit.&rdquo;
                </p>
              </div>
              <div className="rounded-xl bg-[#F7F9FC] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6FCF97]">
                  Connect
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[#1E2430]">
                  &ldquo;You really wanted to stay.&rdquo;
                </p>
              </div>
              <div className="rounded-xl bg-[#F7F9FC] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#D9A441]">
                  Guide
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[#1E2430]">
                  &ldquo;We are leaving now.&rdquo;
                </p>
              </div>
            </div>
          </StepCard>

          {/* Step 3 */}
          <StepCard
            index={2}
            title="Find what works for your child"
            description="Save scripts and discover what helps your child over time."
          >
            <div className="rounded-xl bg-[#F7F9FC] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6FCF97]">
                Insight
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#1E2430]">
                Transitions are a common trigger.
              </p>
            </div>
          </StepCard>
        </div>
      </div>
    </section>
  );
}
