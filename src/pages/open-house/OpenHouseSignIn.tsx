import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { supabase } from "@/integrations/supabase/client";

// Hidden page: reached only from the QR code on a printed open-house sign.
// Not in the nav, footer, scripts/routes.ts or the sitemap, and marked noindex.
// It reuses the existing lead capture (the Sheet Apps Script + public.leads);
// nothing here is a new backend.

const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL;
const CALENDLY = "https://calendly.com/lucasmurphyrei";
const PHONE = "414-458-1952";

// Values from ~/brand/brand.json (published by Realtor OS). Gold is a fill or
// text on ink only; gold-feeling text on ivory uses goldDeep.
const BRAND = {
  ink: "#121110",
  gold: "#C8A96A",
  goldDeep: "#806A43",
  ivory: "#F7EFE0",
  muted: "#6B6661",
  rule: "#B8B0A3",
};
const BODY_FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';

// Same guard as GuideLeadLanding: a sick backend must not stall the form.
function bounded<T>(p: PromiseLike<T>, ms = 8000): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

const DIRECTIONALS = new Set(["n", "s", "e", "w", "ne", "nw", "se", "sw"]);
const SUFFIXES: Record<string, string> = {
  st: "St", ave: "Ave", av: "Ave", rd: "Rd", dr: "Dr", ln: "Ln", ct: "Ct", blvd: "Blvd",
  pl: "Pl", pkwy: "Pkwy", cir: "Cir", ter: "Ter", trl: "Trl", hwy: "Hwy", sq: "Sq",
  way: "Way", apt: "Apt", unit: "Unit",
};

// "3318-n-95th-st" -> "3318 N 95th St"
function slugToAddress(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => {
      const lw = w.toLowerCase();
      if (DIRECTIONALS.has(lw)) return lw.toUpperCase();
      if (SUFFIXES[lw]) return SUFFIXES[lw];
      if (/^\d+(st|nd|rd|th)$/.test(lw)) return lw;
      return lw.charAt(0).toUpperCase() + lw.slice(1);
    })
    .join(" ");
}

function normalizePhone(raw: string): string | null {
  let d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1); // "+1" from autofill
  if (d.length !== 10) return null;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Errors = Partial<Record<"first" | "last" | "phone" | "email" | "agent" | "consent" | "form", string>>;

const labelCls = "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em]";
const fieldCls =
  "block h-12 w-full min-w-0 rounded-md border bg-white px-3.5 text-base outline-none placeholder:text-[#6B6661]/70 focus-visible:border-[#121110] focus-visible:ring-2 focus-visible:ring-[#C8A96A]/60";

export default function OpenHouseSignIn() {
  const [params] = useSearchParams();
  const slug = (params.get("home") || "").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 120);
  const address = slug ? slugToAddress(slug) : "";
  const homeKey = slug || "unspecified";
  const pdfHref = slug ? `/open-house/${slug}.pdf` : "";
  // Drop public/open-house/<slug>.jpg in to show the home above the header.
  const photoSrc = slug ? `/open-house/${slug}.jpg` : "";

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [agent, setAgent] = useState<"Yes" | "No" | "">("");
  const [agentName, setAgentName] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [hasPdf, setHasPdf] = useState(false);
  // A missing photo comes back as index.html, which fails to decode and fires
  // onError, so the image only ever shows when the file is really there.
  const [photoOk, setPhotoOk] = useState(false);

  // The site's SPA rewrite answers a missing file with index.html and a 200, so a
  // 404 alone is not enough: the response must actually be a PDF.
  useEffect(() => {
    if (!pdfHref) return;
    let live = true;
    fetch(pdfHref, { method: "HEAD" })
      .then((r) => {
        if (live) setHasPdf(r.ok && (r.headers.get("content-type") || "").includes("pdf"));
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [pdfHref]);

  useEffect(() => {
    if (done) window.scrollTo(0, 0);
  }, [done]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const f = first.trim();
    const l = last.trim();
    const em = email.trim();
    const ph = normalizePhone(phone);
    const next: Errors = {};
    if (!f) next.first = "Required";
    if (!l) next.last = "Required";
    if (!ph) next.phone = "Enter a 10-digit phone number";
    if (!EMAIL_RE.test(em)) next.email = "Enter a valid email";
    if (!agent) next.agent = "Choose Yes or No";
    if (!consent) next.consent = "Please check the box to sign in";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    const name = `${f} ${l}`;
    const source = `open-house:${homeKey}`;
    const agentLine = agent === "Yes" ? `Yes ${agentName.trim()}`.trim() : "No";
    const sheetConfigured = Boolean(GOOGLE_SHEETS_URL);
    const dbConfigured = Boolean(supabase);

    let sheetPost: Promise<unknown> | null = null;
    if (GOOGLE_SHEETS_URL) {
      const body = new URLSearchParams();
      body.append("name", name);
      body.append("email", em);
      body.append("phone", ph!);
      body.append("timestamp", new Date().toISOString());
      body.append("source", source);
      body.append("working_with_agent", agent);
      body.append("agent_name", agent === "Yes" ? agentName.trim() : "");
      body.append(
        "message",
        `[OPEN HOUSE SIGN-IN]\nProperty: ${address || "unspecified"}\nWorking with agent: ${agentLine}`,
      );
      sheetPost = bounded(fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", body }));
    }

    const dbInsert = supabase
      ? bounded(
          supabase
            .from("leads")
            .insert({
              full_name: name,
              email: em,
              phone: ph,
              source,
              guide: homeKey,
              consent: true, // the form cannot submit without the consent box ticked
            })
            .then(({ error }) => {
              if (error) throw error;
            }),
        )
      : null;

    const [sheet, db] = await Promise.allSettled([sheetPost, dbInsert]);
    const sheetOk = sheetConfigured && sheet.status === "fulfilled";
    const dbOk = dbConfigured && db.status === "fulfilled";
    if (sheetConfigured && sheet.status === "rejected") console.error("[open-house] Sheet post failed", sheet.reason);
    if (dbConfigured && db.status === "rejected") console.error("[open-house] Supabase insert failed", db.reason);

    setLoading(false);
    if (sheetOk || dbOk) {
      setDone(true);
      return;
    }
    console.error("[open-house] No channel accepted the submission", { sheetConfigured, dbConfigured });
    setErrors({ form: `Something went wrong. Please try again, or text me at ${PHONE}.` });
  };

  // Fixing a field clears its message right away instead of on the next submit.
  const clearErr = (k: keyof Errors) =>
    setErrors((prev) => (prev[k] || prev.form ? { ...prev, [k]: undefined, form: undefined } : prev));

  const errText = (msg?: string) =>
    msg ? <p className="mt-1 text-xs font-medium text-[#9B2C1F]">{msg}</p> : null;
  const border = (bad?: string) => ({ borderColor: bad ? "#9B2C1F" : BRAND.rule });

  return (
    <div
      className="min-h-screen antialiased"
      style={{ background: BRAND.ivory, color: BRAND.ink, fontFamily: BODY_FONT }}
    >
      <Seo
        title="Open House Sign-In"
        description="Sign in at Lucas Murphy's open house."
        canonicalPath="/open-house"
        noindex
      />

      {done ? (
        <main className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-8 pt-14">
          <div
            className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full"
            style={{ background: BRAND.ink, boxShadow: `0 0 0 3px ${BRAND.gold}` }}
          >
            <Check className="h-9 w-9" strokeWidth={2.25} style={{ color: BRAND.gold }} aria-hidden />
          </div>
          <h1 className="mt-7 text-center font-display text-[2.15rem] font-medium leading-tight tracking-[-0.01em]">
            Thanks, {first.trim()}.
          </h1>
          <p className="mt-2 text-center font-display text-lg italic leading-snug" style={{ color: BRAND.muted }}>
            Enjoy the tour. I'm here if you have questions.
          </p>

          {address && (
            <div className="mt-8 rounded-lg border bg-white px-4 py-3.5" style={{ borderColor: BRAND.rule }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: BRAND.goldDeep }}>
                This home
              </p>
              <p className="mt-1 text-[15px]">{address}</p>
            </div>
          )}

          <div className="mt-5 space-y-3">
            {hasPdf && (
              <a href={pdfHref} target="_blank" rel="noopener noreferrer" className="oh-outline-btn">
                Download the feature sheet (PDF)
              </a>
            )}
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="oh-outline-btn">
              Book a buyer consult
            </a>
            <a href="/market" className="oh-outline-btn flex-col" style={{ padding: "0.75rem 1rem" }}>
              View my website
              <span className="mt-1 text-[13px] font-normal leading-snug tracking-normal" style={{ color: BRAND.muted }}>
                Local market data and insights: median prices, days on market and monthly trends, town by town
                across Milwaukee, Waukesha, Ozaukee and Washington counties.
              </span>
            </a>
          </div>

          <footer className="mt-auto flex items-center justify-center gap-3 pt-14">
            <img
              src="/open-house/headshot-circle.png"
              alt="Lucas Murphy, Realtor with eXp Realty"
              width={44}
              height={44}
              className="h-11 w-11 rounded-full"
            />
            <div>
              <p className="font-display text-[15px] tracking-[0.18em]">LUCAS MURPHY</p>
              <p className="text-xs">
                <a
                  href={`tel:${PHONE}`}
                  className="rounded-sm underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#121110] active:opacity-70"
                >
                  {PHONE}
                </a>{" "}
                · eXp Realty
              </p>
            </div>
          </footer>
        </main>
      ) : (
        <>
          {photoSrc && (
            // Listing photos are licensed unaltered (no overlays, no color work), so
            // the full frame is shown as delivered.
            <div className={photoOk ? "" : "hidden"} style={{ background: BRAND.ink }}>
              <img
                src={photoSrc}
                alt={`Front of ${address}`}
                onLoad={() => setPhotoOk(true)}
                onError={() => setPhotoOk(false)}
                className="mx-auto block aspect-[3/2] w-full max-w-2xl object-contain"
              />
            </div>
          )}
          <header
            className="px-6 pb-6 text-center"
            style={{
              background: BRAND.ink,
              borderBottom: `4px solid ${BRAND.gold}`,
              paddingTop: photoOk ? "1rem" : "max(2.5rem, calc(env(safe-area-inset-top, 0px) + 1.5rem))",
            }}
          >
            <img src="/open-house/exp-logo-white.png" alt="eXp Realty" className="mx-auto h-7 w-auto" />
            <p
              className="mt-4 font-display text-[11px] uppercase tracking-[0.3em]"
              style={{ color: BRAND.gold }}
            >
              Welcome to the open house
            </p>
            <h1 className="mt-1 font-display text-[1.9rem] font-medium uppercase leading-tight tracking-[0.06em] text-white">
              Please sign in
            </h1>
            {address && <p className="mt-2 text-[13px] font-medium text-white/90">{address}</p>}
          </header>

          <main className="mx-auto max-w-md px-5 pb-10 pt-6">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="min-w-0">
                  <label htmlFor="oh-first" className={labelCls} style={{ color: BRAND.muted }}>
                    First name
                  </label>
                  <input
                    id="oh-first"
                    name="given-name"
                    autoComplete="given-name"
                    autoCapitalize="words"
                    required
                    value={first}
                    onChange={(e) => { setFirst(e.target.value); clearErr("first"); }}
                    className={fieldCls}
                    style={border(errors.first)}
                    aria-invalid={Boolean(errors.first)}
                  />
                  {errText(errors.first)}
                </div>
                <div className="min-w-0">
                  <label htmlFor="oh-last" className={labelCls} style={{ color: BRAND.muted }}>
                    Last name
                  </label>
                  <input
                    id="oh-last"
                    name="family-name"
                    autoComplete="family-name"
                    autoCapitalize="words"
                    required
                    value={last}
                    onChange={(e) => { setLast(e.target.value); clearErr("last"); }}
                    className={fieldCls}
                    style={border(errors.last)}
                    aria-invalid={Boolean(errors.last)}
                  />
                  {errText(errors.last)}
                </div>
              </div>

              <div>
                <label htmlFor="oh-phone" className={labelCls} style={{ color: BRAND.muted }}>
                  Mobile phone
                </label>
                <input
                  id="oh-phone"
                  name="tel"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); clearErr("phone"); }}
                  className={fieldCls}
                  style={border(errors.phone)}
                  aria-invalid={Boolean(errors.phone)}
                />
                {errText(errors.phone)}
              </div>

              <div>
                <label htmlFor="oh-email" className={labelCls} style={{ color: BRAND.muted }}>
                  Email
                </label>
                <input
                  id="oh-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearErr("email"); }}
                  className={fieldCls}
                  style={border(errors.email)}
                  aria-invalid={Boolean(errors.email)}
                />
                {errText(errors.email)}
              </div>

              <div>
                <p id="oh-agent-label" className={labelCls} style={{ color: BRAND.muted }}>
                  Working with an agent?
                </p>
                <div
                  role="radiogroup"
                  aria-labelledby="oh-agent-label"
                  aria-required="true"
                  className="grid grid-cols-2 overflow-hidden rounded-md border bg-white"
                  style={border(errors.agent)}
                >
                  {(["Yes", "No"] as const).map((opt) => {
                    const on = agent === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => { setAgent(opt); clearErr("agent"); }}
                        className="h-12 text-base focus-visible:relative focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#C8A96A] active:opacity-80"
                        style={on ? { background: BRAND.ink, color: "#fff" } : { color: BRAND.ink }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {errText(errors.agent)}
              </div>

              {agent === "Yes" && (
                <div>
                  <label htmlFor="oh-agent-name" className={labelCls} style={{ color: BRAND.muted }}>
                    Agent's name (optional)
                  </label>
                  <input
                    id="oh-agent-name"
                    name="agent-name"
                    autoComplete="off"
                    autoCapitalize="words"
                    placeholder="Agent name"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className={fieldCls}
                    style={border()}
                  />
                </div>
              )}

              <div>
                <label htmlFor="oh-consent" className="flex cursor-pointer items-start gap-3 py-1">
                  <input
                    id="oh-consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => { setConsent(e.target.checked); clearErr("consent"); }}
                    className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#121110] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#121110]"
                    aria-invalid={Boolean(errors.consent)}
                  />
                  <span className="text-[13px] leading-snug" style={{ color: "#3B3835" }}>
                    I agree that Lucas Murphy (eXp Realty) may contact me by phone, text or email about this home
                    and others. Reply STOP anytime.
                  </span>
                </label>
                {errText(errors.consent)}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-[52px] w-full rounded-md text-sm font-bold uppercase tracking-[0.3em] transition-transform duration-150 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#121110] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: BRAND.ink, color: BRAND.gold }}
              >
                {loading ? "Signing in" : "Sign in"}
              </button>
              {errors.form && (
                <p role="alert" className="text-center text-sm font-medium text-[#9B2C1F]">
                  {errors.form}
                </p>
              )}
              <p className="text-center text-[13px]" style={{ color: BRAND.muted }}>
                Your phone fills these in for you.
              </p>
            </form>
          </main>
        </>
      )}

      <style>{`
        .oh-outline-btn {
          display: flex; align-items: center; justify-content: center;
          min-height: 48px; width: 100%; border-radius: 6px;
          border: 1.5px solid ${BRAND.ink}; background: #fff; color: ${BRAND.ink};
          font-size: 15px; font-weight: 700; letter-spacing: 0.04em; text-align: center;
          padding: 0 1rem; transition: transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .oh-outline-btn:hover { background: ${BRAND.ivory}; }
        .oh-outline-btn:focus-visible { outline: 2px solid ${BRAND.ink}; outline-offset: 2px; }
        .oh-outline-btn:active { transform: scale(0.98); }
      `}</style>
    </div>
  );
}
