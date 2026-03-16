import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Landmark, Phone, Mail, Globe, MapPin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { lenderCategories } from "@/data/lenders";
import type { Lender } from "@/data/lenders";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5 },
  }),
};

const LenderCard = ({ lender }: { lender: Lender }) => (
  <Card className="overflow-hidden border-primary/20">
    <CardContent className="p-0">
      <div className="flex flex-col sm:flex-row">
        {/* Photo */}
        <div className="relative shrink-0 sm:w-48">
          <img
            src={lender.image}
            alt={lender.name}
            className="h-72 w-full object-cover object-[center_15%] bg-gray-100 sm:h-full sm:object-cover sm:object-center sm:bg-transparent"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent sm:bg-gradient-to-r" />
        </div>

        {/* Details */}
        <div className="flex-1 p-6 sm:p-8">
          <div className="mb-1 text-sm font-medium tracking-wide text-primary">
            {lender.business}
          </div>
          <h3 className="font-display text-2xl font-bold">
            {lender.name}
            {lender.nmls && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                NMLS# {lender.nmls}
              </span>
            )}
          </h3>

          {lender.bestFor && lender.bestFor.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {lender.bestFor.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary"
                >
                  Best for: {tag}
                </span>
              ))}
            </div>
          )}

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {lender.bio}
          </p>

          {/* Contact Info */}
          <div className="mt-5 grid gap-2 text-sm text-muted-foreground">
            <a
              href={`tel:${lender.phone}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-primary"
            >
              <Phone className="h-4 w-4 shrink-0" />
              {lender.phone}
            </a>
            <a
              href={`mailto:${lender.email}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-primary"
            >
              <Mail className="h-4 w-4 shrink-0" />
              {lender.email}
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              {lender.location}
            </span>
          </div>

          {/* CTA */}
          <div className="mt-6">
            <Button asChild size="sm">
              <a
                href={lender.website}
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

const Lenders = () => (
  <>
    <Helmet>
      <title>Trusted Lenders | Lucas Murphy Real Estate</title>
      <meta
        name="description"
        content="Mortgage lenders and loan officers we recommend for home purchases, refinancing, and investment property financing in the Milwaukee area."
      />
    </Helmet>

    <article className="container max-w-3xl py-16">
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <header className="mb-12">
        <Landmark className="h-10 w-10 text-primary" />
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
          Trusted Lenders
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Mortgage lenders and loan officers we recommend for home purchases,
          refinancing, and investment property financing. Each professional
          listed here comes personally recommended.
        </p>
      </header>

      {lenderCategories.map((category, catIdx) => (
        <section key={category.slug} className="mb-12">
          <h2 className="mb-6 font-display text-2xl font-bold">
            {category.name}
          </h2>
          <div className="space-y-6">
            {category.lenders.map((lender, i) => (
              <motion.div
                key={lender.name}
                custom={catIdx + i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <LenderCard lender={lender} />
              </motion.div>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-16 rounded-lg border border-border bg-secondary/50 p-8 text-center">
        <h3 className="font-display text-2xl font-bold">
          Know a Great Lender?
        </h3>
        <p className="mt-2 text-muted-foreground">
          If you've worked with a reliable mortgage lender in the Milwaukee or
          Waukesha County area, we'd love to hear about them.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/contact">Recommend a Professional</Link>
        </Button>
      </div>
    </article>
  </>
);

export default Lenders;
