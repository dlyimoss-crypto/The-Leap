import Link from "next/link";
import { Caveat } from "next/font/google";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";
import { PatternCorner } from "@/components/pattern-bg";

const caveat = Caveat({ subsets: ["latin"], weight: ["600"] });

const GLOBAL_STATEMENT = ["Every person", "Every country", "Every tribe", "Every culture"];
const QUIET_WORDS = ["Faith", "People", "Purpose", "A brighter tomorrow"];

// A code-composed splash (no photographic background) — a warm sunrise
// glow, a horizon, and a single winding path drawn as minimal SVG, so the
// screen stays on-brand and legible without depending on a hero photo.
// Deliberately dark regardless of the visitor's light/dark preference
// (colors are hardcoded, not theme tokens) — this is a fixed brand
// moment, not a themed surface.
export function WelcomeView() {
  return (
    <main className="relative flex flex-1 flex-col items-center overflow-y-auto bg-[#1c1a18] px-6 py-6 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 100%, rgba(255,122,0,0.32) 0%, rgba(255,122,0,0.08) 45%, transparent 72%)",
        }}
      />
      <PatternCorner corner="top-left" className="text-white" />
      <PatternCorner corner="bottom-right" className="text-white" />

      <div className="relative flex w-full max-w-[420px] flex-1 flex-col">
        <div className="ml-auto space-y-0.5 pt-1">
          {GLOBAL_STATEMENT.map((line) => (
            <p
              key={line}
              className="text-[10px] font-medium tracking-[0.2em] text-white/50 uppercase"
            >
              {line}
            </p>
          ))}
          <div className="ml-auto h-px w-8 bg-primary" />
        </div>

        <div className="flex flex-col items-center gap-2 pt-6">
          <BrandMark className="h-14 w-14" />
          <span className="font-heading text-2xl font-bold tracking-[0.15em] text-white">
            THE LEAP
          </span>
          <p className="text-xs text-white/60">
            Your Essential Companion in Christ
          </p>
        </div>

        <h1 className="pt-8 font-heading text-4xl leading-tight font-bold text-balance text-white">
          Take your next step
          <br />
          <span className="text-primary">with Christ.</span>
        </h1>

        <div className="relative min-h-[130px] flex-1 py-8">
          <svg
            viewBox="0 0 300 160"
            className="h-full w-full"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            <defs>
              <radialGradient id="welcome-sun">
                <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#FF7A00" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="150" cy="112" r="50" fill="url(#welcome-sun)" />
            <line
              x1="0"
              y1="112"
              x2="300"
              y2="112"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
            <path
              d="M36 160 C 90 132, 108 150, 150 116 S 232 88, 264 34"
              fill="none"
              stroke="rgba(255,122,0,0.55)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="1 7"
            />
          </svg>

          <div className="absolute bottom-0 left-0 space-y-0.5 text-left">
            {QUIET_WORDS.map((word) => (
              <p
                key={word}
                className="text-[9px] font-medium tracking-[0.2em] text-white/45 uppercase"
              >
                {word}
              </p>
            ))}
            <div className="h-px w-6 bg-primary" />
          </div>

          <div className="absolute right-0 bottom-0 text-right">
            <p
              className={`${caveat.className} text-xl leading-[1.1] text-white/70`}
            >
              A Brighter
              <br />
              Together
            </p>
            <div className="ml-auto h-px w-8 bg-primary" />
          </div>
        </div>

        <div className="space-y-3 pb-2">
          <Button
            render={<Link href="/sign-in?mode=sign-up" />}
            nativeButton={false}
            size="lg"
            className="w-full rounded-full"
          >
            Get Started
          </Button>
          <Button
            render={<Link href="/sign-in" />}
            nativeButton={false}
            variant="outline"
            size="lg"
            className="w-full rounded-full border-white/30 bg-transparent text-white hover:bg-white/10"
          >
            I Already Have an Account
          </Button>
        </div>

        <div className="space-y-2 pt-4 pb-2">
          <div className="mx-auto h-px w-10 bg-primary" />
          <p className="text-[10px] font-semibold tracking-[0.25em] text-white/60 uppercase">
            Born from Africa. For the world.
          </p>
        </div>
      </div>
    </main>
  );
}
