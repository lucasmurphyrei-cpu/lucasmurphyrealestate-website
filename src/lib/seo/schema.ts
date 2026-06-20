import { siteConfig, sameAsProfiles, absoluteUrl } from "@/lib/siteConfig";

const areaServed = () =>
  siteConfig.counties.map((c) => ({ "@type": "AdministrativeArea", name: `${c} County, Wisconsin` }));

export function organization() {
  return {
    "@type": "Organization",
    "@id": `${siteConfig.url}/#brokerage`,
    name: siteConfig.brokerage,
    url: siteConfig.url,
  };
}

export function realEstateAgent() {
  return {
    "@type": "RealEstateAgent",
    "@id": `${siteConfig.url}/#agent`,
    name: siteConfig.agent.name,
    jobTitle: siteConfig.agent.jobTitle,
    worksFor: organization(),
    url: siteConfig.url,
    image: absoluteUrl(siteConfig.defaultOgImage),
    email: siteConfig.email,
    telephone: siteConfig.phoneE164,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.locality,
      addressRegion: siteConfig.region,
      addressCountry: "US",
    },
    areaServed: areaServed(),
    knowsAbout: [...siteConfig.agent.knowsAbout],
    sameAs: sameAsProfiles,
    description: siteConfig.agent.description,
  };
}

export function webSite() {
  return {
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbList(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function place(countyName: string) {
  return { "@type": "Place", name: `${countyName}, WI` };
}

export function dataset(opts: {
  name: string;
  description: string;
  spatial: string;
  dateModified: string;
  temporalCoverage: string;
  url: string;
}) {
  return {
    "@type": "Dataset",
    name: opts.name,
    description: opts.description,
    spatialCoverage: opts.spatial,
    temporalCoverage: opts.temporalCoverage,
    dateModified: opts.dateModified,
    url: absoluteUrl(opts.url),
    creator: organization(),
    isAccessibleForFree: true,
  };
}

export function faqPage(qas: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: qas.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function article(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
}) {
  return {
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    url: absoluteUrl(opts.url),
    author: realEstateAgent(),
    publisher: organization(),
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
  };
}

export function aggregateRating(opts: { ratingValue: number; reviewCount: number }) {
  return {
    "@type": "AggregateRating",
    ratingValue: opts.ratingValue,
    reviewCount: opts.reviewCount,
    bestRating: 5,
  };
}

/** Wrap one or more schema nodes into a @graph document. */
export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
