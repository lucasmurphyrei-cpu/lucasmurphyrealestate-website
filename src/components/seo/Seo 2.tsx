import { Helmet } from "react-helmet-async";
import { siteConfig, absoluteUrl } from "@/lib/siteConfig";

interface SeoProps {
  title: string;
  description?: string;
  canonicalPath: string;
  ogImage?: string;
  type?: "website" | "article";
  noindex?: boolean;
}

const Seo = ({
  title,
  description,
  canonicalPath,
  ogImage,
  type = "website",
  noindex = false,
}: SeoProps) => {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const canonical = absoluteUrl(canonicalPath);
  const image = absoluteUrl(ogImage ?? siteConfig.defaultOgImage);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default Seo;
