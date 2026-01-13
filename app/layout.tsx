import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import Script from "next/script";

import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SEOLnk - Advanced Link Management & Custom Previews",
    template: "%s | SEOLnk"
  },
  description: "Create custom social media preview cards, password-protected links, expiring URLs, and A/B test rotators. The ultimate tool for link management and analytics.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://seolnk.com'),
  keywords: ["link management", "custom link preview", "url shortener", "seo tools", "social media preview", "link rotator", "expiry link", "password protected link"],
  authors: [{ name: "SEOLnk Team" }],
  creator: "SEOLnk",
  publisher: "SEOLnk",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://seolnk.com",
    title: "SEOLnk - Advanced Link Management & Custom Previews",
    description: "Create custom social media preview cards, password-protected links, expiring URLs, and A/B test rotators.",
    siteName: "SEOLnk",
    images: [
      {
        url: "/og-image.jpg", // Ensure you have a default OG image in public folder
        width: 1200,
        height: 630,
        alt: "SEOLnk - Custom Link Previews",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEOLnk - Advanced Link Management & Custom Previews",
    description: "The ultimate tool for link management. Create custom previews, expiring links, and more.",
    images: ["/og-image.jpg"], // Reusing OG image for consistency
    creator: "@seolnk", // Replace with actual handle if available
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "jDXP6xeTP3wpEYRRRHgeW7-wzrwFGdo-DyJqFR4aPTE",
    yandex: "yandex-verification-code",
    other: {
      me: ["your-personal-site"],
    },
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"; // Fallback placeholder

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics - gtag.js */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // Default consent to 'denied'
            gtag('consent', 'default', {
              'analytics_storage': 'denied'
            });

            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body
        suppressHydrationWarning
        className={`${outfit.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >

        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}

