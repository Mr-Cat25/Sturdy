import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ExampleScriptSection from "@/components/landing/ExampleScriptSection";

function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-8 lg:px-12">
        <a
          href="#top"
          className="text-lg font-semibold tracking-tight text-[#1E2430]"
        >
          Sturdy
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-[#4B5563] transition-colors hover:text-[#1E2430]"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-[#4B5563] transition-colors hover:text-[#1E2430]"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="text-sm font-medium text-[#4B5563] transition-colors hover:text-[#1E2430]"
          >
            FAQ
          </a>
        </nav>

        <a
          href="#start"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-[#5B8DEF] px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#4a7de0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF] focus-visible:ring-offset-2"
        >
          Start Free
        </a>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <main id="top" className="min-h-screen bg-[#F7F9FC] text-[#1E2430]">
      <TopNav />
      <HeroSection />
      <HowItWorksSection />
      <ExampleScriptSection />
    </main>
  );
}

