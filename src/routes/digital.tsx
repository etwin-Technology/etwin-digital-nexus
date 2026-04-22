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

function DigitalProductsSection() {
  const [active, setActive] = useState<(typeof productCategories)[number]>("All");
  const filtered =
    active === "All" ? digitalProducts : digitalProducts.filter((p) => p.type === active);

  return (
    <section className="mt-28">
      <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
        <SectionHeading
          eyebrow="Digital Marketplace"
          title={
            <>
              Ready-made <span className="gradient-text">digital products</span>.
            </>
          }
          description="Templates, themes and modules built by eTwin engineers — download instantly and ship today."
        />
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5 text-primary" /> Instant download
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-primary" /> Lifetime updates
          </span>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        {productCategories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`text-xs sm:text-sm px-4 py-2 rounded-full border transition-all ${
              active === c
                ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_-5px_var(--primary)]"
                : "glass border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p, i) => (
          <DigitalProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}

function DigitalProductCard({ product, index }: { product: DigitalProduct; index: number }) {
  const Icon = product.icon;
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const badgeStyle =
    product.badge === "Bestseller"
      ? "bg-primary/15 text-primary border-primary/30"
      : product.badge === "New"
        ? "bg-highlight/15 text-highlight border-highlight/30"
        : "bg-purple-500/15 text-purple-300 border-purple-500/30";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group relative rounded-2xl glass-strong overflow-hidden hover-lift flex flex-col"
    >
      {/* Visual header */}
      <div className={`relative h-40 bg-gradient-to-br ${product.gradient} overflow-hidden`}>
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-primary/30 blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-20 w-20 rounded-2xl glass-strong flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
              <Icon className="h-9 w-9" />
            </div>
          </div>
        </div>

        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border backdrop-blur-md ${badgeStyle}`}
          >
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-destructive/90 text-destructive-foreground">
            -{discount}%
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Tag className="h-3 w-3" /> {product.type}
          </span>
          <span className="inline-flex items-center gap-1 text-foreground/80">
            <Star className="h-3 w-3 fill-primary text-primary" />
            {product.rating.toFixed(1)}
            <span className="text-muted-foreground">· {product.sales}</span>
          </span>
        </div>

        <h3 className="mt-3 text-lg font-semibold tracking-tight">{product.name}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {product.tagline}
        </p>

        <ul className="mt-4 grid grid-cols-2 gap-1.5 flex-1">
          {product.features.map((f) => (
            <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Check className="h-3 w-3 text-primary flex-shrink-0" />
              <span className="truncate">{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold gradient-text">${product.price}</span>
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ${product.oldPrice}
              </span>
            )}
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-[0_0_20px_-5px_var(--primary)] hover:scale-105 active:scale-95 transition-transform">
            <Download className="h-3.5 w-3.5" /> Buy now
          </button>
        </div>
      </div>
    </motion.article>
  );
}

