interface JsonLdProps {
  data: object;
}

/** Inline JSON-LD. Body-level JSON-LD is valid and is captured by the prerenderer. */
const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

export default JsonLd;
