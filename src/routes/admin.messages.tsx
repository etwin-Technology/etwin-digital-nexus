import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, Trash2, MailOpen } from "lucide-react";
import { toast } from "sonner";
import { api, type ApiMessage } from "@/lib/api";
import { AdminModal, DataTable, PageHeader } from "@/components/admin/AdminUI";

export const Route = createFileRoute("/admin/messages")({
  component: MessagesAdmin,
});

function MessagesAdmin() {
  const [rows, setRows] = useState<ApiMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<ApiMessage | null>(null);

  const load = () => {
    setLoading(true);
    api.get<ApiMessage[]>("/messages").then(setRows).catch((e) => toast.error(e.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const open = async (m: ApiMessage) => {
    setViewing(m);
    if (!m.is_read) {
      try {
        await api.put(`/messages/${m.id}`, { is_read: 1 });
        load();
      } catch {/* ignore */}
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    try {
      await api.delete(`/messages/${id}`);
      toast.success("Deleted");
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <PageHeader title="Contact Messages" description="Inbound messages from the contact form." />

      <DataTable
        loading={loading}
        rows={rows}
        empty="No messages yet."
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
            label: "Sender",
            render: (r) => (
              <div className={r.is_read ? "" : "font-semibold"}>
                <div>{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.email}</div>
              </div>
            ),
          },
          {
            key: "subject",
            label: "Subject",
            render: (r) => <span className={r.is_read ? "" : "font-semibold"}>{r.subject}</span>,
          },
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

      <AdminModal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.subject ?? ""}>
        {viewing && (
          <div className="space-y-4">
            <div className="text-sm">
              <div className="font-medium">{viewing.name}</div>
              <a href={`mailto:${viewing.email}`} className="text-primary text-xs hover:underline">
                {viewing.email}
              </a>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(viewing.created_at).toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg bg-muted/30 border border-border p-4 text-sm whitespace-pre-wrap leading-relaxed">
              {viewing.message}
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
