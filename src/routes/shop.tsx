import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useProducts } from "@/hooks/useApiData";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/Skeletons";
import { SectionHeading } from "@/components/SectionHeading";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Electronics — eTwin" },
      {
        name: "description",
        content: "Browse premium electronics from eTwin — audio, wearables, computers and more.",
      },
      { property: "og:title", content: "Shop Electronics — eTwin" },
      {
        property: "og:description",
        content: "Premium electronics curated by eTwin.",
      },
    ],
  }),
  component: ShopPage,
});

const baseCategories = ["All", "Audio", "Wearables", "Computers", "Mobile", "Accessories"] as const;

function ShopPage() {
  const { data: products = [], isLoading } = useProducts();
  const [category, setCategory] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState(2000);

  const categories = useMemo(() => {
    const set = new Set<string>(baseCategories);
    products.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(
    () =>
      products.filter(
        (p) => (category === "All" || p.category === category) && p.price <= maxPrice,
      ),
    [products, category, maxPrice],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <SectionHeading
        eyebrow="The Shop"
        title={
          <>
            Premium tech, <span className="gradient-text">curated</span>.
          </>
        }
        description="Hardware obsessed over by people who care about every millimetre."
      />

      <div className="mt-12 grid lg:grid-cols-[260px_1fr] gap-10">
        {/* Filters */}
        <aside className="lg:sticky lg:top-24 self-start space-y-6">
          <div className="glass rounded-2xl p-5">
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Category
            </h4>
            <div className="flex flex-wrap lg:flex-col gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                    category === c
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Max price
            </h4>
            <input
              type="range"
              min={50}
              max={2000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
            <div className="mt-2 text-sm">
              up to <span className="font-semibold gradient-text">${maxPrice}</span>
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-6 text-sm text-muted-foreground">
            {isLoading ? "Loading…" : `${filtered.length} product${filtered.length === 1 ? "" : "s"}`}
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
              No products match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
