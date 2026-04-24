import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useProduct, useProducts } from "@/hooks/useApiData";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/product/$productId")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.productId} — eTwin` },
      { property: "og:title", content: `${params.productId} — eTwin` },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-32 text-center">
      <h1 className="text-3xl font-bold">Product not found</h1>
      <Link to="/shop" className="mt-6 inline-block text-primary">
        Back to shop
      </Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { productId } = Route.useParams();
  const { data: product, isLoading, error } = useProduct(productId);
  const { data: all = [] } = useProducts();
  const { add } = useCart();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-32 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    throw notFound();
  }

  const related = all.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-12">
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>

      <div className="grid lg:grid-cols-2 gap-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl glass-strong overflow-hidden aspect-square"
        >
          <div className="absolute -inset-10 bg-primary/15 blur-3xl rounded-full -z-10" />
          <img
            src={product.image}
            alt={product.name}
            width={800}
            height={800}
            className="h-full w-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] uppercase tracking-[0.18em] text-primary mb-4">
            {product.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{product.name}</h1>
          <div className="mt-4 text-3xl font-bold gradient-text">${product.price}</div>
          <p className="mt-6 text-base text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <ul className="mt-8 grid grid-cols-2 gap-3">
            {product.highlights.map((h: string) => (
              <li key={h} className="flex items-center gap-2 text-sm">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-3 w-3" />
                </span>
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <button
              onClick={() => {
                add(product);
                toast.success(`${product.name} added to cart`);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-5px_var(--primary)] hover:scale-[1.03] active:scale-95 transition-transform"
            >
              <ShoppingBag className="h-4 w-4" /> Add to cart
            </button>
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 rounded-full glass-strong px-7 py-3.5 text-sm font-semibold hover:border-primary/50"
            >
              View cart
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 text-xs text-muted-foreground">
            <div className="glass rounded-xl p-3">
              <div className="text-foreground font-semibold">Free shipping</div>
              Worldwide
            </div>
            <div className="glass rounded-xl p-3">
              <div className="text-foreground font-semibold">2-year</div>
              Warranty
            </div>
            <div className="glass rounded-xl p-3">
              <div className="text-foreground font-semibold">30 days</div>
              Free returns
            </div>
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
