import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Truck, Phone, Mail, Globe, MapPin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { moverCategories } from "@/data/movers";
import type { Mover } from "@/data/movers";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5 },
  }),
};

const MoverCard = ({ mover }: { mover: Mover }) => (
  <Card className="overflow-hidden border-primary/20">
    <CardContent className="p-0">
      <div className="flex flex-col sm:flex-row">
        {/* Photo / Logo */}
        <div className={`relative shrink-0 sm:w-56 ${mover.isLogo ? "flex items-center justify-center bg-white p-8" : ""}`}>
          <img
            src={mover.image}
            alt={mover.business}
            className={mover.isLogo ? "w-44 object-contain sm:w-40" : "h-56 w-full object-cover sm:h-full"}
          />
          {!mover.isLogo && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent sm:bg-gradient-to-r" />
          )}
        </div>

        {/* Details */}
        <div className="flex-1 p-6 sm:p-8">
          <div className="mb-1 text-sm font-medium tracking-wide text-primary">
            {mover.business}
          </div>
          <h3 className="font-display text-2xl font-bold">{mover.name}</h3>
          <p className="text-sm text-muted-foreground">{mover.title}</p>

          {mover.serviceAreas && mover.serviceAreas.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {mover.serviceAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  {area}
                </span>
              ))}
            </div>
          )}

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {mover.bio}
          </p>

          {/* Contact Info */}
          <div className="mt-5 grid gap-2 text-sm text-muted-foreground">
            <a
              href={`tel:${mover.phone}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-primary"
            >
              <Phone className="h-4 w-4 shrink-0" />
              {mover.phone} (Cell)
            </a>
            {mover.officePhone && (
              <a
                href={`tel:${mover.officePhone}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4 shrink-0" />
                {mover.officePhone} (Office)
              </a>
            )}
            {mover.email && (
              <a
                href={`mailto:${mover.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {mover.email}
              </a>
            )}
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              {mover.location}
            </span>
          </div>

          {/* CTA */}
          <div className="mt-6">
            <Button asChild size="sm">
              <a
                href={mover.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                Visit Website
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Movers = () => (
  <>
    <Helmet>
      <title>Trusted Movers | Lucas Murphy Real Estate</title>
      <meta
        name="description"
        content="Reliable moving companies in Milwaukee and Waukesha County to make your transition seamless — personally recommended by Lucas Murphy."
      />
      <link rel="canonical" href="https://www.lucasmurphyrealestate.com/resources/movers" />
    </Helmet>

    <article className="container max-w-3xl py-16">
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <header className="mb-12">
        <Truck className="h-10 w-10 text-primary" />
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
          Trusted Movers
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Reliable moving companies in Milwaukee and Waukesha County to make
          your transition seamless. Each professional listed here comes
          personally recommended.
        </p>
      </header>

      {moverCategories.map((category, catIdx) => (
        <section key={category.slug} className="mb-12">
          <h2 className="mb-6 font-display text-2xl font-bold">
            {category.name}
          </h2>
          <div className="space-y-6">
            {category.movers.map((mover, i) => (
              <motion.div
                key={mover.name}
                custom={catIdx + i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <MoverCard mover={mover} />
              </motion.div>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-16 rounded-lg border border-border bg-secondary/50 p-8 text-center">
        <h3 className="font-display text-2xl font-bold">
          Know a Great Moving Company?
        </h3>
        <p className="mt-2 text-muted-foreground">
          If you've worked with a reliable mover in the Milwaukee or Waukesha
          County area, we'd love to hear about them.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/contact">Recommend a Professional</Link>
        </Button>
      </div>
    </article>
  </>
);

export default Movers;
