import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, Phone, Mail, Globe, MapPin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { insuranceCategories } from "@/data/insuranceProviders";
import type { InsuranceProvider } from "@/data/insuranceProviders";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5 },
  }),
};

const ProviderCard = ({ provider }: { provider: InsuranceProvider }) => (
  <Card className="overflow-hidden border-primary/20">
    <CardContent className="p-0">
      <div className="flex flex-col sm:flex-row">
        {/* Photo */}
        <div className="relative shrink-0 sm:w-48">
          <img
            src={provider.image}
            alt={provider.name}
            className="h-56 w-full object-cover sm:h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent sm:bg-gradient-to-r" />
        </div>

        {/* Details */}
        <div className="flex-1 p-6 sm:p-8">
          <div className="mb-1 text-sm font-medium tracking-wide text-primary">
            {provider.business}
          </div>
          <h3 className="font-display text-2xl font-bold">{provider.name}</h3>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {provider.bio}
          </p>

          {/* Contact Info */}
          <div className="mt-5 grid gap-2 text-sm text-muted-foreground">
            <a
              href={`tel:${provider.phone}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-primary"
            >
              <Phone className="h-4 w-4 shrink-0" />
              {provider.phone}
            </a>
            <a
              href={`mailto:${provider.email}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-primary"
            >
              <Mail className="h-4 w-4 shrink-0" />
              {provider.email}
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              {provider.location}
            </span>
          </div>

          {/* CTA */}
          <div className="mt-6">
            <Button asChild size="sm">
              <a
                href={provider.website}
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

const HomeInsurance = () => (
  <>
    <Helmet>
      <title>Home Insurance Providers | Lucas Murphy Real Estate</title>
      <meta
        name="description"
        content="Trusted home insurance providers in Milwaukee, Waukesha, Washington, and Ozaukee Counties — personally recommended by Lucas Murphy."
      />
      <link rel="canonical" href="https://www.lucasmurphyrealestate.com/resources/home-insurance" />
    </Helmet>

    <article className="container max-w-3xl py-16">
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <header className="mb-12">
        <ShieldCheck className="h-10 w-10 text-primary" />
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
          Home Insurance Providers
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Trusted home insurance providers in Milwaukee, Waukesha, Washington,
          and Ozaukee Counties to protect your investment. Each professional
          listed here comes personally recommended.
        </p>
      </header>

      {insuranceCategories.map((category, catIdx) => (
        <section key={category.slug} className="mb-12">
          <h2 className="mb-6 font-display text-2xl font-bold">
            {category.name}
          </h2>
          <div className="space-y-6">
            {category.providers.map((provider, i) => (
              <motion.div
                key={provider.name}
                custom={catIdx + i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <ProviderCard provider={provider} />
              </motion.div>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-16 rounded-lg border border-border bg-secondary/50 p-8 text-center">
        <h3 className="font-display text-2xl font-bold">
          Know a Great Insurance Provider?
        </h3>
        <p className="mt-2 text-muted-foreground">
          If you've worked with a reliable insurance provider in the Milwaukee or
          Waukesha County area, we'd love to hear about them.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/contact">Recommend a Professional</Link>
        </Button>
      </div>
    </article>
  </>
);

export default HomeInsurance;
