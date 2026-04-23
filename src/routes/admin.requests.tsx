import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, Trash2, MailOpen } from "lucide-react";
import { toast } from "sonner";
import { api, type ApiServiceRequest } from "@/lib/api";
import { AdminModal, DataTable, PageHeader } from "@/components/admin/AdminUI";

export const Route = createFileRoute("/admin/requests")({
  component: RequestsAdmin,
});

function RequestsAdmin() {
  const [rows, setRows] = useState<ApiServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<ApiServiceRequest | null>(null);

  const load = () => {
    setLoading(true);
    api
      .get<ApiServiceRequest[]>("/requests")
      .then(setRows)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const open = async (m: ApiServiceRequest) => {
    setViewing(m);
    if (!m.is_read) {
      try {
        await api.put(`/requests/${m.id}`, { is_read: 1 });
        load();
      } catch {/* ignore */}
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm("Delete this request?")) return;
    try {
      await api.delete(`/requests/${id}`);
      toast.success("Deleted");
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <PageHeader title="Service Requests" description="Inbound project enquiries." />

      <DataTable
        loading={loading}
        rows={rows}
        empty="No service requests yet."
        columns={[
          {
            key: "is_read",
            label: "",
            className: "w-8",
            render: (r) =>
              r.is_read ? (
                <MailOpen className="h-4 w-4 text-muted-foreground" />
              ) : (
                <span className="inline-block h-2 w-2 rounded-full bg-primary" />
              ),
          },
          {
            key: "name",
            label: "From",
            render: (r) => (
              <div className={r.is_read ? "" : "font-semibold"}>
                <div>{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.email}</div>
              </div>
            ),
          },
          {
            key: "service_id",
            label: "Service",
            render: (r) => <code className="text-xs px-2 py-0.5 rounded bg-muted">{r.service_id}</code>,
          },
          { key: "budget", label: "Budget", render: (r) => r.budget || "—" },
          {
            key: "created_at",
            label: "Date",
            render: (r) => (
              <span className="text-xs text-muted-foreground">
                {new Date(r.created_at).toLocaleDateString()}
              </span>
            ),
          },
          {
            key: "actions",
            label: "",
            className: "w-24 text-right",
            render: (r) => (
              <div className="flex items-center justify-end gap-1">
                <button onClick={() => open(r)}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted">
                  <Eye className="h-3.5 w-3.5" />
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
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing ? `Request from ${viewing.name}` : ""}
      >
        {viewing && (
          <div className="space-y-4 text-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Email</div>
                <a href={`mailto:${viewing.email}`} className="text-primary hover:underline">
                  {viewing.email}
                </a>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Service</div>
                <div>{viewing.service_id}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Budget</div>
                <div>{viewing.budget || "—"}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Date</div>
                <div>{new Date(viewing.created_at).toLocaleString()}</div>
              </div>
            </div>
            {viewing.message && (
              <div className="rounded-lg bg-muted/30 border border-border p-4 whitespace-pre-wrap leading-relaxed">
                {viewing.message}
              </div>
            )}
          </div>
        )}
      </AdminModal>
    </div>
  );
}
