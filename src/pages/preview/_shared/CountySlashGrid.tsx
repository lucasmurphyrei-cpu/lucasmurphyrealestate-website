import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* Hero background built from N county photos sliced into angled vertical strips
   ("slash grid"): each photo fills ~1/N of the width and is cut from its
   neighbours by a diagonal seam. Mirrors ParallaxBand's API (overlay / minH /
   children + scroll parallax) so it drops straight into a hero. */
export type SlashStrip = { img: string; label?: string };

export default function CountySlashGrid({
  strips,
  overlay = "bg-[#0a1424]/60",
  minH = "min-h-screen",
  slant = 6,
  children,
}: {
  strips: SlashStrip[];
  overlay?: string;
  minH?: string;
  /** horizontal offset of each diagonal seam, in % of width (bigger = steeper) */
  slant?: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.0, 1.06]);

  const n = strips.length;
  const w = 100 / n;
  const o = slant;
  const t = 0.22; // half-thickness of the seam line, in % of width

  return (
    <section ref={ref} className={`relative flex items-center overflow-hidden ${minH}`}>
      <motion.div
        style={{ y, scale }}
        className="pointer-events-none absolute inset-x-0 -top-[8%] h-[116%] will-change-transform"
      >
        {strips.map((s, i) => {
          const lTop = i === 0 ? 0 : w * i + o;
          const lBot = i === 0 ? 0 : w * i - o;
          const rTop = i === n - 1 ? 100 : w * (i + 1) + o;
          const rBot = i === n - 1 ? 100 : w * (i + 1) - o;
          const clip = `polygon(${lTop}% 0, ${rTop}% 0, ${rBot}% 100%, ${lBot}% 100%)`;
          return (
            <div key={i} className="absolute inset-0" style={{ clipPath: clip }}>
              {/* photo sized to its own strip so each county sits centered, not sliced */}
              <img
                src={s.img}
                alt=""
                className="absolute top-0 h-full max-w-none object-cover"
                style={{ left: `${w * i - o}%`, width: `${w + 2 * o}%` }}
              />
              {/* pull the four photos toward one navy palette + ground the headline */}
              <div className="absolute inset-0 bg-[#0a1424]/30 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1424]/85 via-transparent to-[#0a1424]/20" />
              {s.label && (
                <span className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  {s.label}
                </span>
              )}
            </div>
          );
        })}
        {/* diagonal seams cutting the strips apart */}
        {Array.from({ length: n - 1 }).map((_, k) => {
          const seam = k + 1;
          const xTop = w * seam + o;
          const xBot = w * seam - o;
          const navy = `polygon(${xTop - t}% 0, ${xTop + t}% 0, ${xBot + t}% 100%, ${xBot - t}% 100%)`;
          return <div key={k} className="absolute inset-0 bg-[#0a1424]" style={{ clipPath: navy }} />;
        })}
      </motion.div>
      <div className={`absolute inset-0 ${overlay}`} />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 lg:px-10">{children}</div>
    </section>
  );
}
