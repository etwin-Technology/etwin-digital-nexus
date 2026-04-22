import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add } = useCart();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-2xl glass hover-lift"
    >
      <Link
        to="/product/$productId"
        params={{ productId: product.id }}
        className="block"
      >
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-highlight/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <img
            src={product.image}
            alt={product.name}
            width={800}
            height={800}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full glass-strong text-muted-foreground">
            {product.category}
          </span>
        </div>
        <div className="p-5">
          <h3 className="text-base font-semibold tracking-tight">{product.name}</h3>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold gradient-text">${product.price}</span>
          </div>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          add(product);
        }}
        className="absolute bottom-5 right-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_-3px_var(--primary)] hover:scale-110 active:scale-95 transition-transform"
        aria-label={`Add ${product.name} to cart`}
      >
        <Plus className="h-4 w-4" />
      </button>
    </motion.article>
  );
}
