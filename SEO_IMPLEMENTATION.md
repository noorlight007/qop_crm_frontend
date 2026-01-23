# SEO Implementation Guide

This guide shows how to implement SEO meta tags in your QOP CRM Next.js application.

## Files Created/Modified

### 1. Enhanced Layout (`src/app/layout.tsx`)

- Comprehensive metadata configuration
- Open Graph and Twitter Card support
- Schema.org structured data
- Security headers
- Mobile optimization

### 2. Utility Files

- `src/utils/seo.ts` - SEO utility functions
- `src/app/sitemap.ts` - Dynamic sitemap generation

### 3. Public Files

- `public/manifest.json` - PWA manifest
- `public/browserconfig.xml` - Windows tile configuration
- `public/robots.txt` - Search engine crawling rules

## Usage Examples

### Basic Page Metadata

```typescript
// In any page.tsx file
import { Metadata } from "next";
import { generateSEOMetadata } from "@/utils/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Your Page Title",
  description: "Your page description",
  keywords: ["keyword1", "keyword2"],
  canonical: "/your-page-path",
});
```

### Using Pre-defined Metadata

```typescript
// For common pages
import { commonPageMetadata } from "@/utils/seo";

export const metadata = commonPageMetadata.dashboard;
```

### Dynamic Metadata (for dynamic routes)

```typescript
// For dynamic pages like [casealias]/page.tsx
import { Metadata } from "next";
import { generateSEOMetadata } from "@/utils/seo";

interface Props {
  params: { casealias: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Fetch case data here if needed
  const caseData = await fetchCaseData(params.casealias);

  return generateSEOMetadata({
    title: `Case: ${caseData.name}`,
    description: `Manage case ${caseData.name} with QOP CRM`,
    keywords: ["case management", caseData.category],
    canonical: `/cases/${params.casealias}`,
  });
}
```

## Key Features Implemented

### 1. Comprehensive Meta Tags

- Title templates with fallbacks
- Rich descriptions and keywords
- Author and publisher information
- Canonical URLs

### 2. Social Media Optimization

- Open Graph tags for Facebook, LinkedIn
- Twitter Card optimization
- Custom social media images support

### 3. Technical SEO

- Structured data (Schema.org)
- PWA manifest
- Robots.txt
- Sitemap generation
- Security headers

### 4. Mobile Optimization

- Responsive viewport settings
- Apple touch icon support
- Mobile web app capabilities

## Important Notes

### Before Going Live:

1. Replace placeholder URLs with your actual domain
2. Add actual verification codes for search engines
3. Create and add the following images:
   - `/assets/images/logo/qop-og-image.png` (1200x630px)
   - `/assets/images/logo/qop-twitter-image.png` (1200x600px)
4. Update contact information and social media handles
5. Review and customize keyword lists for your specific business

### Image Requirements:

- **Open Graph Image**: 1200x630px (recommended)
- **Twitter Card Image**: 1200x600px (recommended)
- **Favicon**: 32x32px (minimum), supports PNG, ICO
- **Apple Touch Icon**: 180x180px (recommended)

### Performance Tips:

- Images should be optimized for web
- Use Next.js Image component for automatic optimization
- Consider implementing dynamic imports for heavy components

## Monitoring and Analytics

Consider adding these analytics tools:

- Google Analytics 4
- Google Search Console
- Google Tag Manager
- Microsoft Clarity or Hotjar

```typescript
// Example: Adding Google Analytics
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_TRACKING_ID}');
  `}
</Script>
```

This implementation provides a solid foundation for SEO optimization while maintaining flexibility for future enhancements.
