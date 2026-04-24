import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, ShieldCheck, Truck } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { useProducts, useServices } from "@/hooks/useApiData";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton, ServiceCardSkeleton } from "@/components/Skeletons";
import { SectionHeading } from "@/components/SectionHeading";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "eTwin — Power Your Digital World" },
      {
        name: "description",
        content:
          "Shop premium electronics and order bespoke digital services from eTwin — built for ambitious teams.",
      },
      { property: "og:title", content: "eTwin — Power Your Digital World" },
      {
        property: "og:description",
        content: "Premium electronics and digital services from eTwin.",
      },
    ],
  }),
  component: HomePage,
});

const testimonials = [
  {
    quote:
      "eTwin redesigned our entire commerce stack — conversions are up 38% and the team feels three times faster.",
    name: "Amelia Chen",
    role: "CTO, Northwave",
  },
  {
    quote:
      "The Aura headphones are the best I've owned. The eTwin product team really gets craftsmanship.",
    name: "Marcus Reid",
    role: "Sound Engineer",
  },
  {
    quote:
      "From SaaS architecture to launch in 9 weeks. eTwin is the partner every founder dreams about.",
    name: "Priya Natarajan",
    role: "Founder, Lumen Labs",
  },
];

function HomePage() {
  const { data: products, isLoading: prodLoading } = useProducts();
  const { data: services, isLoading: svcLoading } = useServices();
  const featured = (products ?? []).slice(0, 4);
  const featuredServices = (services ?? []).slice(0, 3);

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="mx-auto max-w-7xl px-4 md:px-8 pt-20 md:pt-28 pb-24 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] uppercase tracking-[0.18em] text-primary mb-6">
              <Sparkles className="h-3 w-3" />
              New collection · 2026
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              Power Your <br />
              Digital World <br />
              with <span className="gradient-text">eTwin</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed">
              Premium electronics and bespoke digital services, engineered for the
              people building tomorrow.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-5px_var(--primary)] hover:shadow-[0_0_45px_-2px_var(--primary)] transition-all hover:scale-[1.03]"
              >
                Shop Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/digital"
                className="inline-flex items-center gap-2 rounded-full glass-strong px-6 py-3 text-sm font-semibold hover:border-primary/50 transition-colors"
              >
                Explore Digital Services
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              {[
                { k: "120K+", v: "Happy customers" },
                { k: "98%", v: "Satisfaction" },
                { k: "9 yrs", v: "Of craft" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="text-2xl font-bold gradient-text">{s.k}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -inset-8 bg-primary/20 blur-3xl rounded-full -z-10" />
            <div className="relative aspect-square rounded-3xl overflow-hidden glass-strong animate-float">
              <img
                src={heroImg}
                alt="eTwin premium devices"
                width={1536}
                height={1024}
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* PERKS */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, label: "Free shipping worldwide" },
            { icon: ShieldCheck, label: "2-year warranty" },
            { icon: Zap, label: "Same-day dispatch" },
            { icon: Sparkles, label: "Premium support" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="glass rounded-xl p-4 flex items-center gap-3 hover:border-primary/40 transition-colors"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-20">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <SectionHeading
            eyebrow="Featured Electronics"
            title={
              <>
                Devices built for the <span className="gradient-text">edge</span>.
              </>
            }
            description="Hand-picked tech that combines stunning design with serious performance."
          />
          <Link
            to="/shop"
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {prodLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* DIGITAL SERVICES */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-20">
        <SectionHeading
          eyebrow="Digital Studio"
          title={
            <>
              Services that <span className="gradient-text">scale</span> with you.
            </>
          }
          description="From product design to deployment, we ship beautiful software end-to-end."
          align="center"
        />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {svcLoading
            ? Array.from({ length: 3 }).map((_, i) => <ServiceCardSkeleton key={i} />)
            : featuredServices.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="group relative rounded-2xl glass p-7 hover-lift overflow-hidden"
                  >
                    <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-highlight/20 text-primary border border-primary/20">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 text-xl font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {s.description}
                    </p>
                    <Link
                      to="/digital"
                      className="mt-6 inline-flex items-center gap-1 text-sm text-primary"
                    >
                      Order now <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </motion.div>
                );
              })}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-20">
        <SectionHeading
          eyebrow="Loved by teams"
          title={
            <>
              Trusted by makers <span className="gradient-text">worldwide</span>.
            </>
          }
          align="center"
        />
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl p-7"
            >
              <p className="text-base leading-relaxed">“{t.quote}”</p>
              <footer className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-highlight" />
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-20">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-10 md:p-16 text-center">
          <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Ready to <span className="gradient-text">build something</span> remarkable?
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
            Let's craft your next digital product or upgrade your hardware stack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              to="/digital"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-5px_var(--primary)] hover:scale-[1.03] transition-transform"
            >
              Request a service
            </Link>
            <Link
              to="/shop"
              className="rounded-full glass px-6 py-3 text-sm font-semibold hover:border-primary/50"
            >
              Browse products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
