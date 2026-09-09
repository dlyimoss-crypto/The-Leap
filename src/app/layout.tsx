import type { Metadata, Viewport } from "next";
import { Sora, Karla, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { BottomNav } from "@/components/bottom-nav";
import { CompanionLauncher } from "@/components/companion-launcher";
import { PrivacyShield } from "@/components/privacy-shield";
import { getAuthedUser, getProfile } from "@/lib/supabase/authorize";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const SITE_URL = "https://leapgrow.app";
const SHARE_DESCRIPTION =
  "A daily companion for prayer, scripture and community — join a global family taking their next step with Christ. Born from Africa. For the world.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "The Leap",
  description: "Your Essential Companion in Christ",
  openGraph: {
    title: "The Leap — Your Essential Companion in Christ",
    description: SHARE_DESCRIPTION,
    url: SITE_URL,
    siteName: "The Leap",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Leap — Your Essential Companion in Christ",
    description: SHARE_DESCRIPTION,
  },
  appleWebApp: {
    capable: true,
    title: "The Leap",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#1c1a18",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { user } = await getAuthedUser();

  let isAdmin = false;
  if (user) {
    const profile = await getProfile(user.id);
    isAdmin = profile?.role === "admin";
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <html
      lang={locale}
      className={`${sora.variable} ${karla.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="fixed top-3 right-3 z-50">
            <ThemeToggle />
          </div>
          <div className={user ? "flex flex-1 flex-col pb-16" : "flex flex-1 flex-col"}>
            {children}
          </div>
          {user && <CompanionLauncher dict={dict.companion} />}
          {user && <BottomNav isAdmin={isAdmin} dict={dict.nav} />}
          {user && <PrivacyShield />}
        </ThemeProvider>
      </body>
    </html>
  );
}
