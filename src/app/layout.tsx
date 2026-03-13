import DynamicFavicon from "@/CommonComponent/DynamicFavicon";
import DynamicTitle from "@/CommonComponent/DynamicTitle";
import SessionWrapper from "@/CommonComponent/SessionWrapper";
import NoSsr from "@/utils/NoSsr";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Nunito_Sans } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "../../src/index.scss";
import MainProvider from "./MainProvider";
import { authoption } from "./api/auth/[...nextauth]/authOption";
import { I18nProvider } from "./i18n/i18n-context";
import { detectLanguage } from "./i18n/server";
import ProgressBar from "./progressbar";

const nunito = Nunito_Sans({
  weight: ["200", "300", "400", "500", "600", "700", "800", "900", "1000"],
  style: ["italic", "normal"],
  subsets: ["latin"],
  display: "swap",
  variable: "--nunito",
});

export const metadata: Metadata = {
  title: {
    default: "QOP CRM",
    template: "%s | QOP CRM",
  },
  description:
    "QOP CRM - Comprehensive Customer Relationship Management system for real estate, property management, rent homes, buy houses, and land transactions. Streamline your business operations with our powerful CRM solution.",
  keywords: [
    "QOP",
    "qop",
    "QOP CRM",
    "QOPCRM",
    "qopcrm",
    "qop crm",
    "CRM",
    "crm",
    "QOP CRM",
    "PORTAL",
    "Portal",
    "portal qop crm",
    "portal qopcrm",
    "Customer Relationship Management",
    "Rent Home",
    "rent home",
    "buy house",
    "real estate",
    "property management",
    "buy land",
    "real estate CRM",
    "property CRM",
    "lead management",
    "customer management",
    "sales automation",
    "property listing",
    "rental management",
    "real estate software",
  ],
  authors: [{ name: "QOP Team" }],
  creator: "QOP",
  publisher: "QOP",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://qopcrm.com"), // Replace with your actual domain
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "QOP CRM",
    description:
      "Comprehensive CRM solution for real estate, property management, and customer relations. Manage leads, properties, and transactions efficiently.",
    url: "https://qopcrm.com", // Replace with your actual domain
    siteName: "QOP CRM",
    images: [
      {
        url: "/assets/images/logo/qop-og-image.png", // Add this image to your public folder
        width: 1200,
        height: 630,
        alt: "QOP CRM",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QOP CRM",
    description:
      "Comprehensive CRM solution for real estate, property management, and customer relations.",
    images: ["/assets/images/logo/qop-twitter-image.png"], // Add this image to your public folder
    creator: "@qop_crm", // Replace with your actual Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/assets/images/favicon.png",
    shortcut: "/assets/images/favicon.png",
    apple: "/assets/images/favicon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/assets/images/favicon.png",
    },
  },
  manifest: "/manifest.json",
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
    yandex: "your-yandex-verification-code", // Replace with actual verification code
    yahoo: "your-yahoo-verification-code", // Replace with actual verification code
    other: {
      me: ["mailto:contact@qop-crm.com"], // Replace with your actual email
    },
  },
  category: "technology",
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lng = await detectLanguage();
  const session = await getServerSession(authoption);

  return (
    <I18nProvider language={lng}>
      <html lang="en">
        <head>
          {/* Favicon and Icons */}
          <link
            rel="icon"
            href="/assets/images/favicon.png"
            type="image/x-icon"
          />
          <link
            rel="shortcut icon"
            href="/assets/images/favicon.png"
            type="image/x-icon"
          />
          <link rel="apple-touch-icon" href="/assets/images/favicon.png" />

          {/* Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Raleway:wght@300;400;500;600;700&family=Satisfy&family=Karla:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Caveat:wght@400;500;600;700&family=Open+Sans:wght@300;400;600;700&display=swap"
            rel="stylesheet"
          />

          {/* Additional SEO Meta Tags */}
          <meta name="theme-color" content="#0066cc" />
          <meta name="msapplication-TileColor" content="#0066cc" />
          <meta name="msapplication-config" content="/browserconfig.xml" />

          {/* Viewport and Mobile Optimization */}
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="QOP CRM" />

          {/* Security Headers */}
          <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
          <meta httpEquiv="X-Frame-Options" content="DENY" />
          <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />

          {/* Geo Tags */}
          <meta name="geo.region" content="US" />
          <meta name="geo.placename" content="United States" />

          {/* Business/Organization Schema.org structured data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "QOP CRM",
                description:
                  "Customer Relationship Management system for real estate and property management",
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web Browser",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                },
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: "4.8",
                  ratingCount: "100",
                },
              }),
            }}
          />

          {/* Google Maps API - Uncomment when needed */}
          {/* <script src='https://maps.googleapis.com/maps/api/js?key=AIzaSyAjeJEPREBQFvAIqDSZliF0WjQrCld-Mh0'></script> */}
        </head>
        <body suppressHydrationWarning={true} className={`${nunito.variable}`}>
          <NoSsr>
            <SessionWrapper session={session}>
              <MainProvider>
                <ProgressBar />
                <DynamicFavicon />
                <DynamicTitle />
                {children}
              </MainProvider>
              <ToastContainer />
            </SessionWrapper>
          </NoSsr>
        </body>
      </html>
    </I18nProvider>
  );
}
