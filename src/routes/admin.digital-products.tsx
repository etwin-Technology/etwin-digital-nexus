import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api, type ApiDigitalProduct } from "@/lib/api";
import {
  AdminButton,
  AdminInput,
  AdminModal,
  AdminSelect,
  AdminTextarea,
  DataTable,
  FeaturesField,
  PageHeader,
} from "@/components/admin/AdminUI";

export const Route = createFileRoute("/admin/digital-products")({
  component: DigitalAdmin,
});

const TYPES = [
  "Website Template",
  "WordPress Theme",
  "Chatbot Module",
  "Odoo Module",
  "Shopify Theme",
  "Dashboard Kit",
];
const BADGES = ["", "Bestseller", "New", "Pro"];

const empty = (): ApiDigitalProduct => ({
  id: "",
  name: "",
  type: "Website Template",
  price: 0,
  old_price: null,
  rating: 5,
  sales: 0,
  tagline: "",
  features: [],
  badge: null,
  download_url: null,
});

function DigitalAdmin() {
  const [rows, setRows] = useState<ApiDigitalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ApiDigitalProduct | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get<ApiDigitalProduct[]>("/digital-products")
      .then(setRows)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const onSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const payload = { ...editing, badge: editing.badge || null };
      if (isNew) {
        await api.post("/digital-products", payload);
        toast.success("Created");
      } else {
        await api.put(`/digital-products/${editing.id}`, payload);
        toast.success("Updated");
      }
      setEditing(null);
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this digital product?")) return;
    try {
      await api.delete(`/digital-products/${id}`);
      toast.success("Deleted");
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <PageHeader
        title="Digital Products"
        description="Templates, themes, modules — everything sold instantly."
        action={
          <AdminButton
            onClick={() => {
              setEditing(empty());
              setIsNew(true);
            }}
          >
            <Plus className="h-4 w-4" /> New
          </AdminButton>
        }
      />

      <DataTable
        loading={loading}
        rows={rows}
        empty="No digital products yet."
        columns={[
          { key: "name", label: "Name", render: (r) => <div className="font-medium">{r.name}</div> },
          { key: "type", label: "Type" },
          {
            key: "price",
            label: "Price",
            render: (r) => (
              <div>
                <span className="font-semibold">${Number(r.price).toFixed(0)}</span>
                {r.old_price && (
                  <span className="ml-2 text-xs text-muted-foreground line-through">
                    ${Number(r.old_price).toFixed(0)}
                  </span>
                )}
              </div>
            ),
          },
          { key: "sales", label: "Sales" },
          {
            key: "badge",
            label: "Badge",
            render: (r) => r.badge ?? <span className="text-muted-foreground">—</span>,
          },
          {
            key: "actions",
            label: "",
            className: "w-24 text-right",
            render: (r) => (
              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => { setEditing(r); setIsNew(false); }}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDelete(r.id)}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ),
          },
        ]}
      />

      <AdminModal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={isNew ? "New digital product" : `Edit · ${editing?.name}`}
      >
        {editing && (
          <form
            onSubmit={(e) => { e.preventDefault(); onSave(); }}
            className="space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <AdminInput
                label="ID (slug)" value={editing.id} disabled={!isNew} required
                onChange={(e) => setEditing({ ...editing, id: e.target.value })}
              />
              <AdminInput
                label="Name" value={editing.name} required
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
              <AdminSelect
                label="Type" options={TYPES} value={editing.type}
                onChange={(e) => setEditing({ ...editing, type: e.target.value })}
              />
              <AdminSelect
                label="Badge" options={BADGES} value={editing.badge ?? ""}
                onChange={(e) => setEditing({ ...editing, badge: e.target.value || null })}
              />
              <AdminInput
                label="Price" type="number" step="0.01" value={editing.price}
                onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
              />
              <AdminInput
                label="Old price (optional)" type="number" step="0.01"
                value={editing.old_price ?? ""}
                onChange={(e) => setEditing({ ...editing, old_price: e.target.value === "" ? null : Number(e.target.value) })}
              />
              <AdminInput
                label="Rating" type="number" step="0.1" min="0" max="5" value={editing.rating}
                onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}
              />
              <AdminInput
                label="Sales" type="number" value={editing.sales}
                onChange={(e) => setEditing({ ...editing, sales: Number(e.target.value) })}
              />
            </div>
            <AdminTextarea
              label="Tagline" rows={2} value={editing.tagline}
              onChange={(e) => setEditing({ ...editing, tagline: e.target.value })}
            />
            <FeaturesField
              label="Features"
              value={editing.features}
              onChange={(features) => setEditing({ ...editing, features })}
            />
            <AdminInput
              label="Download URL (optional)" value={editing.download_url ?? ""}
              onChange={(e) => setEditing({ ...editing, download_url: e.target.value || null })}
            />
            <div className="flex justify-end gap-2 pt-2">
              <AdminButton type="button" variant="secondary" onClick={() => setEditing(null)}>
                Cancel
              </AdminButton>
              <AdminButton type="submit" loading={saving}>
                {isNew ? "Create" : "Save changes"}
              </AdminButton>
            </div>
          </form>
        )}
      </AdminModal>
    </div>
  );
}
