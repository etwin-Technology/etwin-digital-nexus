import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check, Star, Download, Tag } from "lucide-react";
import { useState } from "react";
import { services } from "@/data/services";
import { digitalProducts, type DigitalProduct } from "@/data/digitalProducts";
import { SectionHeading } from "@/components/SectionHeading";

const productCategories = [
  "All",
  "Website Template",
  "WordPress Theme",
  "Chatbot Module",
  "Odoo Module",
  "Shopify Theme",
  "Dashboard Kit",
] as const;

export const Route = createFileRoute("/digital")({
  head: () => ({
    meta: [
      { title: "Digital Services — eTwin" },
      {
        name: "description",
        content:
          "Bespoke digital services by eTwin: web development, eCommerce, SaaS solutions, AI integrations and more.",
      },
      { property: "og:title", content: "Digital Services — eTwin" },
      {
        property: "og:description",
        content: "Web, eCommerce, SaaS and AI — built end-to-end by eTwin.",
      },
    ],
  }),
  component: DigitalPage,
});

const process = [
  { step: "01", title: "Discover", text: "We dive deep to understand your goals and constraints." },
  { step: "02", title: "Design", text: "Pixel-perfect prototypes that align stakeholders early." },
  { step: "03", title: "Build", text: "Modern stack, clean architecture, fast iteration." },
  { step: "04", title: "Launch", text: "Monitoring, analytics, and continuous improvements." },
];

function DigitalPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <SectionHeading
        eyebrow="Digital Studio"
        title={
          <>
            We design and ship <span className="gradient-text">digital products</span>.
          </>
        }
        description="From the first sketch to the production deploy, eTwin is the team behind the scenes building the platforms you love."
      />

      {/* Services */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative rounded-2xl glass p-7 hover-lift overflow-hidden flex flex-col"
            >
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-highlight/20 text-primary border border-primary/20">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {s.description}
              </p>
              <ul className="mt-5 space-y-2 flex-1">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary group/cta"
              >
                Request Service
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-1" />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* DIGITAL PRODUCTS MARKETPLACE */}
      <DigitalProductsSection />

      {/* Process */}
      <section className="mt-28">
        <SectionHeading
          eyebrow="Our Process"
          title={
            <>
              A clear path from <span className="gradient-text">idea to launch</span>.
            </>
          }
          align="center"
        />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {process.map((p, i) => (
            <motion.div
              key={p.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl p-6 relative overflow-hidden"
            >
              <span className="absolute top-3 right-4 text-5xl font-bold opacity-10">
                {p.step}
              </span>
              <h4 className="text-lg font-semibold">{p.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-24">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-10 md:p-14 text-center">
          <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Have a project in mind? <span className="gradient-text">Let's talk.</span>
          </h2>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-5px_var(--primary)] hover:scale-[1.03] transition-transform"
          >
            Start a project <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
