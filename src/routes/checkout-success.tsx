import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Package, Download, Loader2, Lock, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { API_URL, api, type ApiDigitalProduct, type ApiDownloadToken } from "@/lib/api";

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

type DigitalRow = {
  product: ApiDigitalProduct;
  token?: ApiDownloadToken;
  error?: string;
  loading: boolean;
};

function SuccessPage() {
  const { orderId, total } = Route.useSearch();
  const [downloads, setDownloads] = useState<DigitalRow[] | null>(null);

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    (async () => {
      const raw = sessionStorage.getItem(`etwin:order:${orderId}`);
      if (!raw) return;
      try {
        const { email, productIds } = JSON.parse(raw) as { email: string; productIds: string[] };
        const all = await api.get<ApiDigitalProduct[]>("/digital-products");
        const map = new Map(all.map((p) => [p.id, p]));
        const digital = productIds.map((id) => map.get(id)).filter(Boolean) as ApiDigitalProduct[];
        if (digital.length === 0) return;
        const initial: DigitalRow[] = digital.map((p) => ({ product: p, loading: true }));
        if (!cancelled) setDownloads(initial);
        const results = await Promise.all(
          digital.map(async (p) => {
            try {
              const t = await api.post<ApiDownloadToken>("/downloads", {
                product_id: p.id,
                email,
                order_id: orderId,
              });
              return { product: p, token: t, loading: false } as DigitalRow;
            } catch (e: any) {
              return { product: p, error: e?.message ?? "Not available yet", loading: false } as DigitalRow;
            }
          }),
        );
        if (!cancelled) setDownloads(results);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

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
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold gradient-text text-lg">${total.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}

      {downloads && downloads.length > 0 && (
        <div className="mt-6 glass-strong rounded-2xl p-6 text-left">
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
            <Download className="h-4 w-4 text-primary" /> Your downloads
          </h2>
          <ul className="divide-y divide-border">
            {downloads.map((d) => (
              <li key={d.product.id} className="py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium truncate">{d.product.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {d.product.is_free ? "Free download" : "Premium"}
                  </div>
                </div>
                {d.loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : d.token ? (
                  <a
                    href={`${API_URL}/downloads?token=${d.token.token}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:scale-105 transition-transform"
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" /> {d.error || "Pending payment"}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-3 w-3" /> Paid links expire in 24h · Free links last 30 days
          </p>
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
