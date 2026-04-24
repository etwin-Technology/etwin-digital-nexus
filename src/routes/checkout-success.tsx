import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Package } from "lucide-react";

export const Route = createFileRoute("/checkout-success")({
  validateSearch: (search: Record<string, unknown>) => ({
    orderId: Number(search.orderId) || 0,
    total: Number(search.total) || 0,
  }),
  head: () => ({
    meta: [
      { title: "Order Confirmed — eTwin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { orderId, total } = Route.useSearch();

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.7 }}
        className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-primary/15 mb-8"
      >
        <Check className="h-12 w-12 text-primary" />
      </motion.div>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
        Thank <span className="gradient-text">you!</span>
      </h1>
      <p className="mt-4 text-muted-foreground">
        Your order has been confirmed. We've sent a receipt to your inbox.
      </p>

      {orderId > 0 && (
        <div className="mt-10 glass-strong rounded-2xl p-6 text-left">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Package className="h-5 w-5" />
            </span>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Order number</div>
              <div className="font-semibold">#{orderId}</div>
            </div>
          </div>
          {total > 0 && (
            <div className="flex justify-between border-t border-border pt-4 text-sm">
              <span className="text-muted-foreground">Total paid</span>
              <span className="font-bold gradient-text text-lg">${total.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-3 justify-center">
        <Link
          to="/shop"
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-5px_var(--primary)] hover:scale-[1.03] transition-transform"
        >
          Continue shopping
        </Link>
        <Link to="/" className="rounded-full glass px-6 py-3 text-sm font-semibold hover:border-primary/50">
          Back to home
        </Link>
      </div>
    </div>
  );
}
