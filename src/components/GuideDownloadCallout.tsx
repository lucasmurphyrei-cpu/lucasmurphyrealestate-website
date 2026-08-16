import { Download } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface GuideDownloadCalloutProps {
  /** Path under /public, e.g. "/Relocating_to_Metro_Milwaukee_Guide.pdf" */
  href: string;
  /** One line describing what they get — page count and what's inside. */
  description: string;
  label?: string;
  /**
   * Override the outer spacing. The default `mb-12` suits a block sitting at
   * the top of a guide page; under a card grid it wants a top margin instead.
   */
  className?: string;
  /**
   * Optional in-app link shown beneath the description, for pointing an
   * ungated download at the gated long-form guide it summarises.
   */
  secondary?: { to: string; label: string };
}

/**
 * The download block that sits at the top of every guide page.
 *
 * Extracted once five guide pages needed it. It was copied by hand into the
 * seasonal and seller pages first; a third copy is the point at which the
 * markup starts drifting between pages, so it lives here instead.
 *
 * `not-prose` matters: these pages render inside GuidePageTemplate's prose
 * wrapper, which would otherwise restyle the anchor as body copy and undo the
 * button treatment.
 */
const GuideDownloadCallout = ({
  href,
  description,
  label = "Download the full guide",
  className,
  secondary,
}: GuideDownloadCalloutProps) => (
  <div
    className={cn(
      "not-prose mb-12 flex flex-col items-start gap-4 rounded-sm border border-accent/30 bg-accent/[0.06] p-5 sm:flex-row sm:items-center sm:gap-5",
      className,
    )}
  >
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-accent/12 text-accent">
      <Download className="h-5 w-5" />
    </div>
    <div className="flex-1">
      <p className="font-display text-lg font-semibold">{label}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
      {secondary && (
        <Link
          to={secondary.to}
          className="mt-2 inline-block text-sm font-semibold text-foreground underline decoration-accent decoration-2 underline-offset-4 transition-opacity duration-300 hover:opacity-70"
        >
          {secondary.label}
        </Link>
      )}
    </div>
    <a
      href={href}
      download
      className="group inline-flex items-center gap-2 rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-all duration-300 hover:-translate-y-0.5"
    >
      <Download className="h-4 w-4" /> Download PDF
    </a>
  </div>
);

export default GuideDownloadCallout;
