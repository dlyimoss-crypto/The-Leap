import Link from "next/link";

// The hero image carries the headline, tagline, and both button graphics as
// baked-in pixels (founder-supplied artwork, not composed from live text)
// — so the two invisible overlays below are real, keyboard- and
// screen-reader-accessible links positioned over their matching graphics
// (percentages measured directly from the source image's pixel bounds),
// and the <img>'s alt text carries the screen's full copy for anyone who
// can't see the image at all.
export function WelcomeView() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-[#1c1a18]">
      <div className="relative w-full max-w-[480px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/welcome-splash.jpg"
          alt="The Leap — Your Essential Companion in Christ. Every person, every country, every tribe, every culture. Take your next step with Christ. Faith, people, purpose, a brighter tomorrow — a brighter together. A winding path leads toward a sunrise over a misty river valley. Born from Africa. For the world."
          className="block h-auto w-full"
        />

        <Link
          href="/sign-in?mode=sign-up"
          aria-label="Get Started"
          className="absolute inset-x-[14.7%] top-[75.7%] h-[5.1%] rounded-full outline-offset-2 focus-visible:outline-2 focus-visible:outline-white"
        />
        <Link
          href="/sign-in"
          aria-label="I already have an account"
          className="absolute inset-x-[14.7%] top-[82.0%] h-[5.1%] rounded-full outline-offset-2 focus-visible:outline-2 focus-visible:outline-white"
        />
      </div>
    </main>
  );
}
