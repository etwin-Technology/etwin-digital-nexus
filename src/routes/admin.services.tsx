import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api, type ApiService } from "@/lib/api";
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

export const Route = createFileRoute("/admin/services")({
  component: ServicesAdmin,
});

const ICONS = ["Code2", "ShoppingBag", "Cloud", "Smartphone", "Sparkles", "ShieldCheck", "Zap", "Layout"];

const empty = (): ApiService => ({
  id: "",
  title: "",
  icon: "Sparkles",
  description: "",
  features: [],
});

function ServicesAdmin() {
  const [rows, setRows] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ApiService | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get<ApiService[]>("/services").then(setRows).catch((e) => toast.error(e.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const onSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (isNew) {
        await api.post("/services", editing);
        toast.success("Created");
      } else {
        await api.put(`/services/${editing.id}`, editing);
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
    if (!confirm("Delete this service?")) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success("Deleted");
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <PageHeader
        title="Services"
        description="Manage the digital services offered by eTwin."
        action={
          <AdminButton onClick={() => { setEditing(empty()); setIsNew(true); }}>
            <Plus className="h-4 w-4" /> New service
          </AdminButton>
        }
      />

      <DataTable
        loading={loading}
        rows={rows}
        columns={[
          { key: "title", label: "Title", render: (r) => <div className="font-medium">{r.title}</div> },
          { key: "icon", label: "Icon", render: (r) => <code className="text-xs px-2 py-0.5 rounded bg-muted">{r.icon}</code> },
          {
            key: "features",
            label: "Features",
            render: (r) => <span className="text-xs text-muted-foreground">{r.features.length} items</span>,
          },
          {
            key: "actions",
            label: "",
            className: "w-24 text-right",
            render: (r) => (
              <div className="flex items-center justify-end gap-1">
                <button onClick={() => { setEditing(r); setIsNew(false); }}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => onDelete(r.id)}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
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
        title={isNew ? "New service" : `Edit · ${editing?.title}`}
      >
        {editing && (
          <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <AdminInput
                label="ID (slug)" value={editing.id} disabled={!isNew} required
                onChange={(e) => setEditing({ ...editing, id: e.target.value })}
              />
              <AdminInput
                label="Title" value={editing.title} required
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
              <AdminSelect
                label="Icon" options={ICONS} value={editing.icon}
                onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
              />
            </div>
            <AdminTextarea
              label="Description" rows={3} value={editing.description}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
            <FeaturesField
              label="Features"
              value={editing.features}
              onChange={(features) => setEditing({ ...editing, features })}
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
