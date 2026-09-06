import Link from "next/link";

// The hero image carries the headline, tagline, and both button graphics as
// baked-in pixels (a founder-approved design concept, not composed from live
// text) — so the two invisible overlays below are real, keyboard- and
// screen-reader-accessible links positioned over their matching graphics,
// and the <img>'s alt text carries the screen's full copy for anyone who
// can't see the image at all.
export function WelcomeView() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-[#1c1a18]">
      <div className="relative w-full max-w-[480px]" style={{ aspectRatio: "503 / 1000" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/welcome-splash.jpg"
          alt="The Leap — Your Essential Companion in Christ. Take your next step with Christ. A diverse, global community journeying together toward a sunrise over a river valley and city. Born from Africa. For the world."
          className="size-full object-cover"
        />

        <Link
          href="/sign-in?mode=sign-up"
          aria-label="Get Started"
          className="absolute inset-x-[12.8%] top-[78.3%] h-[4.6%] rounded-full outline-offset-2 focus-visible:outline-2 focus-visible:outline-white"
        />
        <Link
          href="/sign-in"
          aria-label="I already have an account"
          className="absolute inset-x-[12.8%] top-[85.2%] h-[4.3%] rounded-full outline-offset-2 focus-visible:outline-2 focus-visible:outline-white"
        />
      </div>
    </main>
  );
}
