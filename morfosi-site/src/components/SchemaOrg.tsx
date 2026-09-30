/**
 * JSON-LD Structured Data for Morfosi Frontistirio.
 *
 * Implements:
 * - EducationalOrganization (main)
 * - LocalBusiness (for Google Maps / rich results)
 * - FAQPage (for the FAQ accordion on the contact page)
 * - BreadcrumbList (injected per-page via the SchemaPage component)
 */

interface SchemaOrgProps {
  phone?: string;
  email?: string;
  address?: string;
  /** Override the base URL if needed */
  url?: string;
}

export function OrganizationSchema({
  phone = "210 506 3610",
  email = "chronakesm@gmail.com",
  address = "25ης Μαρτίου 84, Άγιος Δημήτριος, 17342",
  url = "https://morfosi.edu.gr",
}: SchemaOrgProps) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      // ─── EducationalOrganization ───────────────────────────────────
      {
        "@type": "EducationalOrganization",
        "@id": `${url}/#organization`,
        name: "Φροντιστήριο Μόρφωση",
        alternateName: ["Morfosi", "ΜΟΡΦΩΣΗ"],
        url,
        logo: {
          "@type": "ImageObject",
          url: `${url}/logo.png`,
          width: 512,
          height: 512,
        },
        description:
          "Κορυφαίο ιδιωτικό φροντιστήριο μέσης εκπαίδευσης στον Άγιο Δημήτριο. Ολιγομελή τμήματα Γυμνασίου & Λυκείου, εξειδικευμένη προετοιμασία Πανελλαδικών. Από το 2001.",
        telephone: phone,
        email,
        foundingDate: "2001",
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Αττική, Ελλάδα",
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: "25ης Μαρτίου 84",
          addressLocality: "Άγιος Δημήτριος",
          addressRegion: "Αττική",
          postalCode: "17342",
          addressCountry: "GR",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: phone,
          contactType: "customer support",
          availableLanguage: "Greek",
          hoursAvailable: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "15:00",
              closes: "21:30",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Saturday"],
              opens: "09:00",
              closes: "15:00",
            },
          ],
        },
        sameAs: [
          "https://www.facebook.com/morfosi",
          "https://www.instagram.com/morfosi",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Εκπαιδευτικά Τμήματα",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Course",
                name: "Τμήματα Γυμνασίου",
                description: "Μαθήματα για μαθητές Α΄, Β΄, Γ΄ Γυμνασίου. Μέγιστο 7 μαθητές ανά τμήμα.",
                provider: { "@type": "EducationalOrganization", name: "Φροντιστήριο Μόρφωση" },
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Course",
                name: "Τμήματα Λυκείου & Πανελλαδικών",
                description: "Εντατική προετοιμασία για Πανελλαδικές Εξετάσεις.",
                provider: { "@type": "EducationalOrganization", name: "Φροντιστήριο Μόρφωση" },
              },
            },
          ],
        },
      },

      // ─── LocalBusiness ──────────────────────────────────────────────
      {
        "@type": ["LocalBusiness", "EducationalOrganization"],
        "@id": `${url}/#localbusiness`,
        name: "Φροντιστήριο Μόρφωση",
        image: `${url}/og-image.jpg`,
        url,
        telephone: phone,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "25ης Μαρτίου 84",
          addressLocality: "Άγιος Δημήτριος",
          addressRegion: "Αττική",
          postalCode: "17342",
          addressCountry: "GR",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 37.9305,
          longitude: 23.7285,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "15:00",
            closes: "21:30",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Saturday"],
            opens: "09:00",
            closes: "15:00",
          },
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "87",
          bestRating: "5",
        },
      },

      // ─── WebSite ─────────────────────────────────────────────────────
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: "Φροντιστήριο Μόρφωση",
        publisher: { "@id": `${url}/#organization` },
        inLanguage: "el",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${url}/news?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── FAQ Schema for contact page ──────────────────────────────────────────────
interface FAQItem { q: string; a: string }
export function FAQSchema({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Breadcrumb Schema for inner pages ────────────────────────────────────────
interface BreadcrumbItem { name: string; url: string }
export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Course Schema for individual program pages ────────────────────────────────
interface CourseSchemaProps {
  name: string;
  description: string;
  url: string;
}
export function CourseSchema({ name, description, url }: CourseSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url,
    provider: {
      "@type": "EducationalOrganization",
      name: "Φροντιστήριο Μόρφωση",
      sameAs: "https://morfosi.edu.gr",
    },
    inLanguage: "el",
    educationalLevel: "HighSchool",
    teaches: name,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
