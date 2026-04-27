import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { api, type ApiSettings } from "@/lib/api";
import { AdminButton, AdminInput, PageHeader } from "@/components/admin/AdminUI";

export const Route = createFileRoute("/admin/settings")({ component: SettingsAdmin });

function SettingsAdmin() {
  const [data, setData] = useState<ApiSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<ApiSettings>("/settings").then(setData).catch((e) => toast.error(e.message)).finally(() => setLoading(false));
  }, []);

  const set = (k: string, v: string) => setData((d) => ({ ...d, [k]: v }));

  const save = async () => {
    setSaving(true);
    try { await api.put("/settings", data); toast.success("Settings saved"); }
    catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <PageHeader title="Store Settings" description="Configure your store branding, contact channels and pricing." />
      {loading ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">Loading…</div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); save(); }} className="space-y-8 max-w-2xl">
          <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Branding</h3>
            <AdminInput label="Store name" value={data.store_name ?? ""} onChange={(e) => set("store_name", e.target.value)} />
            <AdminInput label="Currency code" value={data.currency ?? "USD"} onChange={(e) => set("currency", e.target.value)} />
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Contact channels</h3>
            <AdminInput
              label="WhatsApp number (with country code, no spaces)"
              placeholder="e.g. 212600000000"
              value={data.whatsapp_number ?? ""}
              onChange={(e) => set("whatsapp_number", e.target.value.replace(/[^\d]/g, ""))}
            />
            <p className="text-xs text-muted-foreground">Used by the store WhatsApp button and admin order notifications. Format: digits only with country code (e.g. 212600000000).</p>
            <AdminInput label="Contact email" type="email" value={data.contact_email ?? ""} onChange={(e) => set("contact_email", e.target.value)} />
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Checkout</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <AdminInput label="Flat shipping" type="number" step="0.01" value={data.shipping_flat ?? "19"} onChange={(e) => set("shipping_flat", e.target.value)} />
              <AdminInput label="Free shipping over" type="number" step="0.01" value={data.free_shipping_over ?? "500"} onChange={(e) => set("free_shipping_over", e.target.value)} />
              <AdminInput label="Tax rate (0–1)" type="number" step="0.01" value={data.tax_rate ?? "0.08"} onChange={(e) => set("tax_rate", e.target.value)} />
            </div>
          </section>

          <div className="flex justify-end">
            <AdminButton type="submit" loading={saving}><Save className="h-4 w-4" /> Save settings</AdminButton>
          </div>
        </form>
      )}
    </div>
  );
}
