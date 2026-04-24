import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft, CreditCard, Loader2, Lock, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — eTwin" },
      { name: "description", content: "Complete your eTwin order securely." },
      { property: "og:title", content: "Checkout — eTwin" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, totalPrice, clear } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "",
  });

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-32 text-center">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full glass mb-6">
          <ShoppingBag className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Nothing to checkout</h1>
        <p className="mt-3 text-muted-foreground">Add some products to your cart first.</p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  const shipping = totalPrice > 500 ? 0 : 19;
  const tax = +(totalPrice * 0.08).toFixed(2);
  const grand = +(totalPrice + shipping + tax).toFixed(2);

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fullAddress = [form.address, form.city, form.zip, form.country].filter(Boolean).join(", ");
      const res = await api.post<{ success: boolean; order_id: number; total: number }>("/orders", {
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        address: fullAddress,
        items: items.map((i) => ({
          product_id: i.product.id,
          product_name: i.product.name,
          unit_price: i.product.price,
          quantity: i.quantity,
        })),
      });
      clear();
      toast.success(`Order #${res.order_id} placed!`);
      navigate({ to: "/checkout-success", search: { orderId: res.order_id, total: res.total } });
    } catch (err: any) {
      toast.error(err?.message ?? "Checkout failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Back to cart
      </Link>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">Checkout</h1>

      <form onSubmit={submit} className="grid lg:grid-cols-[1fr_400px] gap-8">
        {/* LEFT — form */}
        <div className="space-y-6">
          <section className="glass-strong rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Contact</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Full name" value={form.name} onChange={(v) => update("name", v)} required />
              <Input label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} required />
            </div>
            <Input label="Phone (optional)" value={form.phone} onChange={(v) => update("phone", v)} />
          </section>

          <section className="glass-strong rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Shipping address</h2>
            <Input label="Street address" value={form.address} onChange={(v) => update("address", v)} required />
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="City" value={form.city} onChange={(v) => update("city", v)} required />
              <Input label="ZIP / Postal" value={form.zip} onChange={(v) => update("zip", v)} required />
              <Input label="Country" value={form.country} onChange={(v) => update("country", v)} required />
            </div>
          </section>

          <section className="glass-strong rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" /> Payment
            </h2>
            <p className="text-sm text-muted-foreground">
              This is a demo checkout — your order is recorded but no card is charged. Pay-on-delivery
              available; full payment integrations on request.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
              <Lock className="h-3.5 w-3.5 text-primary" /> Secure SSL · Data encrypted in transit
            </div>
          </section>
        </div>

        {/* RIGHT — summary */}
        <aside className="glass-strong rounded-2xl p-6 h-fit lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold mb-4">Order summary</h2>
          <ul className="space-y-3 mb-4 max-h-72 overflow-y-auto pr-1">
            {items.map((i) => (
              <li key={i.product.id} className="flex items-center gap-3 text-sm">
                <div className="h-12 w-12 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                  {i.product.image && (
                    <img src={i.product.image} alt={i.product.name} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">{i.product.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Qty {i.quantity} · ${i.product.price}
                  </div>
                </div>
                <div className="text-sm font-semibold">${(i.product.price * i.quantity).toFixed(2)}</div>
              </li>
            ))}
          </ul>

          <dl className="space-y-2 text-sm border-t border-border pt-4">
            <Row label="Subtotal" value={`$${totalPrice.toFixed(2)}`} />
            <Row label="Shipping" value={shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`} />
            <Row label="Tax (8%)" value={`$${tax.toFixed(2)}`} />
            <div className="border-t border-border pt-3 flex justify-between text-base font-semibold">
              <dt>Total</dt>
              <dd className="gradient-text text-xl">${grand.toFixed(2)}</dd>
            </div>
          </dl>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-5px_var(--primary)] hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-60 disabled:hover:scale-100"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Placing order…
              </>
            ) : (
              <>Place order · ${grand.toFixed(2)}</>
            )}
          </button>
          <p className="mt-3 text-xs text-muted-foreground text-center">
            By placing your order you agree to our terms.
          </p>
        </aside>
      </form>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl bg-input/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary/60 transition-colors"
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
