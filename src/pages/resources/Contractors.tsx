import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Hammer, Phone, Mail, Globe, MapPin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { contractorCategories } from "@/data/contractors";
import type { Contractor } from "@/data/contractors";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5 },
  }),
};

const ContractorCard = ({ contractor }: { contractor: Contractor }) => (
  <Card className="overflow-hidden border-primary/20">
    <CardContent className="p-0">
      <div className="flex flex-col sm:flex-row">
        {/* Photo */}
        <div className={`relative shrink-0 sm:w-48 ${contractor.isLogo ? "flex items-center justify-center bg-secondary/50 p-6" : ""}`}>
          <img
            src={contractor.image}
            alt={contractor.name}
            className={contractor.isLogo ? "h-36 w-36 object-contain sm:h-32 sm:w-32" : "h-56 w-full object-cover object-top sm:h-full sm:object-contain sm:object-center sm:bg-[#3a5a2a]"}
          />
          {!contractor.isLogo && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent sm:bg-gradient-to-r" />
          )}
        </div>

        {/* Details */}
        <div className="flex-1 p-6 sm:p-8">
          <div className="mb-1 text-sm font-medium tracking-wide text-primary">
            {contractor.business}
          </div>
          <h3 className="font-display text-2xl font-bold">{contractor.name}</h3>

          {contractor.serviceAreas && contractor.serviceAreas.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {contractor.serviceAreas.map((area) => (
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
            {contractor.bio}
          </p>

          {/* Contact Info */}
          <div className="mt-5 grid gap-2 text-sm text-muted-foreground">
            <a
              href={`tel:${contractor.phone}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-primary"
            >
              <Phone className="h-4 w-4 shrink-0" />
              {contractor.phone}
            </a>
            {contractor.email && (
              <a
                href={`mailto:${contractor.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {contractor.email}
              </a>
            )}
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              {contractor.location}
            </span>
          </div>

          {/* CTA */}
          <div className="mt-6">
            <Button asChild size="sm">
              <a
                href={contractor.website}
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

const Contractors = () => (
  <>
    <Helmet>
      <title>Trusted Contractors | Lucas Murphy Real Estate</title>
      <meta
        name="description"
        content="Reliable contractors in Milwaukee and Waukesha County for renovations, repairs, and home improvement projects — personally recommended by Lucas Murphy."
      />
      <link rel="canonical" href="https://www.lucasmurphyrealestate.com/resources/contractors" />
    </Helmet>

    <article className="container max-w-3xl py-16">
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <header className="mb-12">
        <Hammer className="h-10 w-10 text-primary" />
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
          Trusted Contractors
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Reliable contractors in Milwaukee and Waukesha County for renovations,
          repairs, and home improvement projects. Each professional listed here
          comes personally recommended.
        </p>
      </header>

      {contractorCategories.map((category, catIdx) => (
        <section key={category.slug} className="mb-12">
          <h2 className="mb-6 font-display text-2xl font-bold">
            {category.name}
          </h2>
          <div className="space-y-6">
            {category.contractors.map((contractor, i) => (
              <motion.div
                key={contractor.name}
                custom={catIdx + i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <ContractorCard contractor={contractor} />
              </motion.div>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-16 rounded-lg border border-border bg-secondary/50 p-8 text-center">
        <h3 className="font-display text-2xl font-bold">
          Know a Great Contractor?
        </h3>
        <p className="mt-2 text-muted-foreground">
          If you've worked with a reliable contractor in the Milwaukee or
          Waukesha County area, we'd love to hear about them.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/contact">Recommend a Professional</Link>
        </Button>
      </div>
    </article>
  </>
);

export default Contractors;
