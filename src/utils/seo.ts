import { Metadata } from "next";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  canonical,
  ogImage,
  noindex = false,
}: SEOProps): Metadata {
  const baseUrl = "https://portal.qopcrm.com"; // Replace with your actual domain

  const seoTitle = title
    ? `${title} | QOP CRM`
    : "QOP CRM - Customer Relationship Management System";

  const seoDescription = description
    ? description
    : "Comprehensive CRM solution for real estate, property management, and customer relations. Manage leads, properties, and transactions efficiently.";

  const defaultKeywords = [
    "QOP",
    "qop",
    "QOP CRM",
    "QOPCRM",
    "qopcrm",
    "qop crm",
    "QOP CRM - Customer Relationship Management System",
    "CRM",
    "crm",
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
  ];

  const allKeywords = [...defaultKeywords, ...keywords];

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: allKeywords,
    robots: noindex ? "noindex,nofollow" : "index,follow",
    alternates: {
      canonical: canonical ? `${baseUrl}${canonical}` : undefined,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonical ? `${baseUrl}${canonical}` : baseUrl,
      siteName: "QOP CRM",
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: seoTitle,
            },
          ]
        : undefined,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

// Pre-defined metadata for common pages
export const commonPageMetadata = {
  dashboard: generateSEOMetadata({
    title: "Dashboard",
    description:
      "Access your QOP CRM dashboard to manage customers, properties, and business operations efficiently.",
    keywords: ["dashboard", "CRM dashboard", "business management"],
    canonical: "/dashboard",
  }),

  login: generateSEOMetadata({
    title: "Login",
    description:
      "Sign in to your QOP CRM account to access your customer relationship management tools.",
    keywords: ["login", "sign in", "access account"],
    canonical: "/auth/login",
  }),

  register: generateSEOMetadata({
    title: "Register",
    description:
      "Create your QOP CRM account and start managing your business relationships effectively.",
    keywords: ["register", "sign up", "create account"],
    canonical: "/auth/register",
  }),

  cases: generateSEOMetadata({
    title: "Cases Management",
    description:
      "Manage and track all your business cases, leads, and customer interactions in one place.",
    keywords: ["cases", "lead management", "customer tracking"],
    canonical: "/cases",
  }),

  documents: generateSEOMetadata({
    title: "Document Management",
    description:
      "Upload, organize, and manage all your business documents securely in the cloud.",
    keywords: ["documents", "file management", "document storage"],
    canonical: "/documents",
  }),
};

export default generateSEOMetadata;
