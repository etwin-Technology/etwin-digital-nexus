import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api, type ApiProduct } from "@/lib/api";
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

export const Route = createFileRoute("/admin/products")({
  component: ProductsAdmin,
});

const CATEGORIES = ["Audio", "Wearables", "Computers", "Mobile", "Accessories"];

const empty = (): ApiProduct => ({
  id: "",
  name: "",
  price: 0,
  category: "Accessories",
  image: "",
  description: "",
  highlights: [],
  stock: 0,
});

function ProductsAdmin() {
  const [rows, setRows] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ApiProduct | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get<ApiProduct[]>("/products").then(setRows).catch((e) => toast.error(e.message)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (isNew) {
        await api.post("/products", editing);
        toast.success("Product created");
      } else {
        await api.put(`/products/${editing.id}`, editing);
        toast.success("Product updated");
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
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Deleted");
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your physical electronics catalog."
        action={
          <AdminButton
            onClick={() => {
              setEditing(empty());
              setIsNew(true);
            }}
          >
            <Plus className="h-4 w-4" /> New product
          </AdminButton>
        }
      />

      <DataTable
        loading={loading}
        rows={rows}
        empty="No products yet."
        columns={[
          {
            key: "image",
            label: "",
            className: "w-16",
            render: (r) => (
              <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden">
                {r.image && (
                  <img src={r.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                )}
              </div>
            ),
          },
          { key: "name", label: "Name", render: (r) => <div className="font-medium">{r.name}</div> },
          { key: "category", label: "Category" },
          {
            key: "price",
            label: "Price",
            render: (r) => <span className="font-semibold">${Number(r.price).toFixed(2)}</span>,
          },
          { key: "stock", label: "Stock" },
          {
            key: "actions",
            label: "",
            className: "w-24 text-right",
            render: (r) => (
              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => {
                    setEditing(r);
                    setIsNew(false);
                  }}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                  aria-label="Edit"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDelete(r.id)}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  aria-label="Delete"
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
        title={isNew ? "New product" : `Edit · ${editing?.name}`}
      >
        {editing && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSave();
            }}
            className="space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <AdminInput
                label="ID (slug)"
                value={editing.id}
                disabled={!isNew}
                onChange={(e) => setEditing({ ...editing, id: e.target.value })}
                required
              />
              <AdminInput
                label="Name"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                required
              />
              <AdminInput
                label="Price (USD)"
                type="number"
                step="0.01"
                value={editing.price}
                onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
              />
              <AdminInput
                label="Stock"
                type="number"
                value={editing.stock}
                onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })}
              />
              <AdminSelect
                label="Category"
                options={CATEGORIES}
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              />
              <AdminInput
                label="Image URL"
                value={editing.image}
                onChange={(e) => setEditing({ ...editing, image: e.target.value })}
              />
            </div>
            <AdminTextarea
              label="Description"
              rows={3}
              value={editing.description}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
            <FeaturesField
              label="Highlights"
              value={editing.highlights}
              onChange={(highlights) => setEditing({ ...editing, highlights })}
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
