import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ClipboardCheck, Phone, Mail, Globe, MapPin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { inspectorCategories } from "@/data/homeInspectors";
import type { HomeInspector } from "@/data/homeInspectors";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5 },
  }),
};

const InspectorCard = ({ inspector }: { inspector: HomeInspector }) => (
  <Card className="overflow-hidden border-primary/20">
    <CardContent className="p-0">
      <div className="flex flex-col sm:flex-row">
        {/* Logo / Photo */}
        <div className="relative shrink-0 sm:w-64 flex items-center justify-center bg-white p-6">
          <img
            src={inspector.image}
            alt={inspector.business}
            className="max-h-40 w-auto object-contain"
          />
        </div>

        {/* Details */}
        <div className="flex-1 p-6 sm:p-8">
          <h3 className="font-display text-2xl font-bold">{inspector.business}</h3>

          {inspector.serviceAreas && inspector.serviceAreas.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {inspector.serviceAreas.map((area) => (
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
            {inspector.bio}
          </p>

          {/* Contact Info */}
          <div className="mt-5 grid gap-2 text-sm text-muted-foreground">
            {inspector.phones && inspector.phones.length > 0 ? (
              inspector.phones.map((p) => (
                <a
                  key={p.number}
                  href={`tel:${p.number}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  {p.label}: {p.number}
                </a>
              ))
            ) : (
              <a
                href={`tel:${inspector.phone}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4 shrink-0" />
                {inspector.phone}
              </a>
            )}
            {inspector.email && (
              <a
                href={`mailto:${inspector.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {inspector.email}
              </a>
            )}
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              {inspector.location}
            </span>
          </div>

          {/* CTA */}
          <div className="mt-6">
            <Button asChild size="sm">
              <a
                href={inspector.website}
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

const HomeInspectors = () => (
  <>
    <Helmet>
      <title>Trusted Home Inspectors | Lucas Murphy Real Estate</title>
      <meta
        name="description"
        content="Thorough, reliable home inspectors serving Milwaukee County and Waukesha County — personally recommended by Lucas Murphy."
      />
      <link rel="canonical" href="https://www.lucasmurphyrealestate.com/resources/home-inspectors" />
    </Helmet>

    <article className="container max-w-3xl py-16">
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <header className="mb-12">
        <ClipboardCheck className="h-10 w-10 text-primary" />
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
          Trusted Home Inspectors
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Thorough, reliable home inspectors serving Milwaukee County and
          Waukesha County. Each professional listed here comes personally
          recommended.
        </p>
      </header>

      {inspectorCategories.map((category, catIdx) => (
        <section key={category.slug} className="mb-12">
          <h2 className="mb-6 font-display text-2xl font-bold">
            {category.name}
          </h2>
          <div className="space-y-6">
            {category.inspectors.map((inspector, i) => (
              <motion.div
                key={inspector.name}
                custom={catIdx + i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <InspectorCard inspector={inspector} />
              </motion.div>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-16 rounded-lg border border-border bg-secondary/50 p-8 text-center">
        <h3 className="font-display text-2xl font-bold">
          Know a Great Home Inspector?
        </h3>
        <p className="mt-2 text-muted-foreground">
          If you've worked with a reliable home inspector in the Milwaukee or
          Waukesha County area, we'd love to hear about them.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/contact">Recommend a Professional</Link>
        </Button>
      </div>
    </article>
  </>
);

export default HomeInspectors;
