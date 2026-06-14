import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* Reusable scroll-driven parallax photo band (Wix Parallax/ParallaxZoom style):
   the background translates slower than the page and slowly zooms as it scrolls by. */
export type ParallaxBandProps = {
  src: string;
  video?: string;
  overlay?: string;
  split?: boolean;
  fixedBg?: boolean;
  align?: "center" | "end";
  objectPosition?: string;
  minH?: string;
  cornerLabel?: ReactNode;
  children: ReactNode;
};

export default function ParallaxBand({
  src,
  video,
  overlay = "bg-[#0a1424]/72",
  split = false,
  fixedBg = false,
  align = "center",
  objectPosition,
  minH = "min-h-[60vh]",
  cornerLabel,
  children,
}: ParallaxBandProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.0, 1.06]);
  return (
    <section ref={ref} className={`relative flex overflow-hidden ${align === "end" ? "items-end" : "items-center"} ${minH}`}>
      {fixedBg ? (
        /* Background sized to the viewport and pinned — shows the full scene + scroll-reveal */
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url("${src}")` }}
        />
      ) : (
        <motion.div
          style={{ y, scale }}
          className="pointer-events-none absolute inset-x-0 -top-[10%] h-[120%] will-change-transform"
        >
          {video ? (
            <video
              src={video}
              poster={src}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="h-full w-full object-cover"
              style={{ objectPosition }}
            />
          ) : (
            <img src={src} alt="" className="h-full w-full object-cover" style={{ objectPosition }} />
          )}
        </motion.div>
      )}
      {split ? (
        /* photo shows at the top, background resolves to solid navy where the cards begin */
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,20,36,0.30)_0%,rgba(10,20,36,0.50)_22%,rgb(10,20,36)_50%,rgb(10,20,36)_100%)]" />
      ) : (
        <div className={`absolute inset-0 ${overlay}`} />
      )}
      {cornerLabel && (
        <div className="pointer-events-none absolute left-5 top-[40%] z-20 lg:left-12">{cornerLabel}</div>
      )}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 lg:px-10">{children}</div>
    </section>
  );
}
