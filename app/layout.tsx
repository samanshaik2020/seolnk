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

  // Enhanced Keywords for Better SEO
  keywords: [
    "link management", "custom link preview", "url shortener", "seo tools",
    "social media preview", "link rotator", "expiry link", "password protected link",
    "bio link page", "link in bio", "custom url", "branded links", "link tracking",
    "click analytics", "social media optimization", "og tags", "preview cards",
    "link shortener with analytics", "a/b testing links", "qr code generator",
    "utm builder", "marketing links", "influencer tools", "content creators",
    "digital marketing", "link customization", "secure links", "temporary links"
  ],

  authors: [{ name: "SEOLnk Team" }],
  creator: "SEOLnk",
  publisher: "SEOLnk",

  // Category for better classification
  category: "Technology",

  // Application Name
  applicationName: "SEOLnk",

  // Referrer Policy
  referrer: "origin-when-cross-origin",

  // Enhanced Open Graph Tags
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://seolnk.com",
    title: "SEOLnk - Advanced Link Management & Custom Previews",
    description: "Transform your links with custom previews, analytics, and advanced features. Perfect for marketers, creators, and businesses.",
    siteName: "SEOLnk",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SEOLnk - Custom Link Previews & Advanced Link Management",
        type: "image/jpeg",
      },
      {
        url: "/og-image-square.jpg",
        width: 1200,
        height: 1200,
        alt: "SEOLnk Logo",
        type: "image/jpeg",
      },
    ],
  },

  // Enhanced Twitter Card Tags
  twitter: {
    card: "summary_large_image",
    site: "@seolnk",
    creator: "@seolnk",
    title: "SEOLnk - Advanced Link Management & Custom Previews",
    description: "Create stunning custom link previews, password-protected URLs, expiring links, and link rotators. Track everything with powerful analytics.",
    images: {
      url: "/og-image.jpg",
      alt: "SEOLnk - The Ultimate Link Management Platform",
    },
  },

  // Robots Configuration
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification Codes
  verification: {
    google: "jDXP6xeTP3wpEYRRRHgeW7-wzrwFGdo-DyJqFR4aPTE",
    yandex: "yandex-verification-code",
    other: {
      me: ["https://seolnk.com"],
    },
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-icon.png",
      },
    ],
  },

  // Manifest for PWA
  manifest: "/manifest.json",

  // Additional Meta Tags
  other: {
    // Google Site Verification (alternative method)
    "google-site-verification": "jDXP6xeTP3wpEYRRRHgeW7-wzrwFGdo-DyJqFR4aPTE",

    // Theme Color for mobile browsers
    "theme-color": "#1a1a2e",
    "msapplication-TileColor": "#1a1a2e",

    // Facebook Domain Verification (if needed)
    "facebook-domain-verification": "your-facebook-verification-code",

    // Pinterest Verification (if needed)
    "p:domain_verify": "your-pinterest-verification-code",

    // Apple Mobile Web App
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "SEOLnk",

    // Format Detection
    "format-detection": "telephone=no",

    // X (Twitter) specific
    "twitter:app:name:iphone": "SEOLnk",
    "twitter:app:name:ipad": "SEOLnk",
    "twitter:app:name:googleplay": "SEOLnk",

    // Additional OG tags
    "og:site_name": "SEOLnk",
    "og:locale": "en_US",
    "og:type": "website",
    "og:updated_time": new Date().toISOString(),

    // Content Language
    "content-language": "en",

    // Rating
    "rating": "general",

    // Distribution
    "distribution": "global",

    // Revisit After
    "revisit-after": "7 days",

    // Coverage
    "coverage": "Worldwide",
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
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-N626T38C');`}
        </Script>
        {/* End Google Tag Manager */}

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

        {/* JSON-LD Structured Data for Rich Google Results */}
        <Script id="structured-data-organization" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "SEOLnk",
            "url": "https://seolnk.com",
            "logo": "https://seolnk.com/icon.png",
            "description": "Advanced link management platform for creating custom link previews, password-protected URLs, expiring links, and link rotators with powerful analytics.",
            "foundingDate": "2024",
            "sameAs": [
              "https://twitter.com/seolnk",
              "https://facebook.com/seolnk",
              "https://linkedin.com/company/seolnk"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "email": "support@seolnk.com",
              "contactType": "Customer Support",
              "availableLanguage": ["English"]
            }
          })}
        </Script>

        <Script id="structured-data-website" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "SEOLnk",
            "url": "https://seolnk.com",
            "description": "Create custom social media preview cards, password-protected links, expiring URLs, and A/B test rotators with advanced analytics.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://seolnk.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </Script>

        <Script id="structured-data-webapp" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "SEOLnk",
            "url": "https://seolnk.com",
            "applicationCategory": "BusinessApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "1250",
              "bestRating": "5",
              "worstRating": "1"
            },
            "operatingSystem": "Any",
            "browserRequirements": "Requires JavaScript. Requires HTML5.",
            "description": "Transform your links with custom previews, analytics, and advanced features. Perfect for marketers, creators, and businesses."
          })}
        </Script>

        <Script id="structured-data-breadcrumb" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://seolnk.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Features",
                "item": "https://seolnk.com/features"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Pricing",
                "item": "https://seolnk.com/pricing"
              }
            ]
          })}
        </Script>
      </head>
      <body
        suppressHydrationWarning
        className={`${outfit.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N626T38C"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          >
          </iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}

