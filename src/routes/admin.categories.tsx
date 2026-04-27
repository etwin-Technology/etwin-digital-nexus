import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api, type ApiCategory } from "@/lib/api";
import {
  AdminButton, AdminInput, AdminModal, DataTable, PageHeader,
} from "@/components/admin/AdminUI";

export const Route = createFileRoute("/admin/categories")({ component: CategoriesAdmin });

const empty = (): ApiCategory => ({ id: "", name: "", slug: "", icon: "", sort_order: 0 });

function CategoriesAdmin() {
  const [rows, setRows] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ApiCategory | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get<ApiCategory[]>("/categories").then(setRows).catch((e) => toast.error(e.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (isNew) await api.post("/categories", editing);
      else await api.put(`/categories/${editing.id}`, editing);
      toast.success("Saved");
      setEditing(null);
      load();
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this category? Products will keep their text label.")) return;
    try { await api.delete(`/categories/${id}`); toast.success("Deleted"); load(); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organize your storefront — products link to a category."
        action={<AdminButton onClick={() => { setEditing(empty()); setIsNew(true); }}><Plus className="h-4 w-4" /> New category</AdminButton>}
      />
      <DataTable loading={loading} rows={rows} empty="No categories yet."
        columns={[
          { key: "name", label: "Name", render: (r) => <div className="font-medium">{r.name}</div> },
          { key: "slug", label: "Slug", render: (r) => <code className="text-xs text-muted-foreground">{r.slug}</code> },
          { key: "icon", label: "Icon" },
          { key: "product_count", label: "Products", render: (r) => r.product_count ?? 0 },
          { key: "sort_order", label: "Order" },
          {
            key: "actions", label: "", className: "w-24 text-right",
            render: (r) => (
              <div className="flex items-center justify-end gap-1">
                <button onClick={() => { setEditing(r); setIsNew(false); }} className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => onDelete(r.id)} className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            ),
          },
        ]}
      />
      <AdminModal open={!!editing} onClose={() => setEditing(null)} title={isNew ? "New category" : `Edit · ${editing?.name}`}>
        {editing && (
          <form onSubmit={(e) => { e.preventDefault(); save(); }} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <AdminInput label="ID (slug)" value={editing.id} disabled={!isNew} required onChange={(e) => setEditing({ ...editing, id: e.target.value, slug: editing.slug || e.target.value })} />
              <AdminInput label="Name" value={editing.name} required onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              <AdminInput label="Slug" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              <AdminInput label="Icon (lucide name)" value={editing.icon ?? ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} />
              <AdminInput label="Sort order" type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <AdminButton type="button" variant="secondary" onClick={() => setEditing(null)}>Cancel</AdminButton>
              <AdminButton type="submit" loading={saving}>{isNew ? "Create" : "Save"}</AdminButton>
            </div>
          </form>
        )}
      </AdminModal>
    </div>
  );
}
