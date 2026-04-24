import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — eTwin" },
      { name: "description", content: "Review your eTwin cart and check out securely." },
      { property: "og:title", content: "Your Cart — eTwin" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, setQuantity, remove, totalPrice, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-32 text-center">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full glass mb-6">
          <ShoppingBag className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Your cart is empty</h1>
        <p className="mt-3 text-muted-foreground">
          Browse the shop and discover devices crafted to last.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-5px_var(--primary)] hover:scale-[1.03] transition-transform"
        >
          Start shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const shipping = totalPrice > 500 ? 0 : 19;
  const tax = totalPrice * 0.08;
  const grand = totalPrice + shipping + tax;

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Your Cart</h1>
          <p className="mt-2 text-muted-foreground">
            {items.length} item{items.length === 1 ? "" : "s"} ready for checkout
          </p>
        </div>
        <button
          onClick={clear}
          className="text-sm text-muted-foreground hover:text-destructive"
        >
          Clear cart
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        <ul className="space-y-3">
          <AnimatePresence>
            {items.map((item) => (
              <motion.li
                key={item.product.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-2xl p-4 flex gap-4 items-center"
              >
                <Link
                  to="/product/$productId"
                  params={{ productId: item.product.id }}
                  className="h-24 w-24 rounded-xl overflow-hidden bg-secondary flex-shrink-0"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    width={200}
                    height={200}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    to="/product/$productId"
                    params={{ productId: item.product.id }}
                    className="font-semibold hover:text-primary transition-colors"
                  >
                    {item.product.name}
                  </Link>
                  <div className="text-xs text-muted-foreground mt-1">
                    {item.product.category}
                  </div>
                  <div className="mt-2 text-sm gradient-text font-bold">
                    ${item.product.price}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center glass rounded-full">
                    <button
                      onClick={() => setQuantity(item.product.id, item.quantity - 1)}
                      className="h-8 w-8 inline-flex items-center justify-center hover:text-primary"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(item.product.id, item.quantity + 1)}
                      className="h-8 w-8 inline-flex items-center justify-center hover:text-primary"
                      aria-label="Increase"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => remove(item.product.id)}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-full glass hover:text-destructive hover:border-destructive/40"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <aside className="glass-strong rounded-2xl p-6 h-fit lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>${totalPrice.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Tax</dt>
              <dd>${tax.toFixed(2)}</dd>
            </div>
            <div className="border-t border-border pt-3 flex justify-between text-base font-semibold">
              <dt>Total</dt>
              <dd className="gradient-text text-xl">${grand.toFixed(2)}</dd>
            </div>
          </dl>
          <Link
            to="/checkout"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-5px_var(--primary)] hover:scale-[1.02] active:scale-95 transition-transform"
          >
            Checkout <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-xs text-muted-foreground text-center">
            Secure checkout · Free returns within 30 days
          </p>
        </aside>
      </div>
    </div>
  );
}
