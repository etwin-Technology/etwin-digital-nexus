import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api, type ApiOrder } from "@/lib/api";
import {
  AdminButton,
  AdminModal,
  AdminSelect,
  DataTable,
  PageHeader,
} from "@/components/admin/AdminUI";
import { StatusBadge } from "@/routes/admin.index";

export const Route = createFileRoute("/admin/orders")({
  component: OrdersAdmin,
});

const STATUSES = ["pending", "paid", "shipped", "completed", "cancelled"];

function OrdersAdmin() {
  const [rows, setRows] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<ApiOrder | null>(null);
  const [statusEdit, setStatusEdit] = useState("");

  const load = () => {
    setLoading(true);
    api.get<ApiOrder[]>("/orders").then(setRows).catch((e) => toast.error(e.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const open = async (id: number) => {
    try {
      const o = await api.get<ApiOrder>(`/orders/${id}`);
      setViewing(o);
      setStatusEdit(o.status);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const updateStatus = async () => {
    if (!viewing) return;
    try {
      await api.put(`/orders/${viewing.id}`, { status: statusEdit });
      toast.success("Status updated");
      setViewing(null);
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm("Delete this order?")) return;
    try {
      await api.delete(`/orders/${id}`);
      toast.success("Deleted");
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <PageHeader title="Orders" description="Customer orders from the storefront." />

      <DataTable
        loading={loading}
        rows={rows}
        empty="No orders yet."
        columns={[
          { key: "id", label: "#", render: (r) => <span className="font-mono text-xs">#{r.id}</span> },
          {
            key: "customer_name",
            label: "Customer",
            render: (r) => (
              <div>
                <div className="font-medium">{r.customer_name}</div>
                <div className="text-xs text-muted-foreground">{r.customer_email}</div>
              </div>
            ),
          },
          { key: "item_count", label: "Items", render: (r) => r.item_count ?? "—" },
          {
            key: "total",
            label: "Total",
            render: (r) => <span className="font-semibold">${Number(r.total).toFixed(2)}</span>,
          },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
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
                <button onClick={() => open(r.id)}
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

      <AdminModal open={!!viewing} onClose={() => setViewing(null)} title={`Order #${viewing?.id}`}>
        {viewing && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <Info label="Customer" value={viewing.customer_name} />
              <Info label="Email" value={viewing.customer_email} />
              <Info label="Phone" value={viewing.customer_phone || "—"} />
              <Info label="Date" value={new Date(viewing.created_at).toLocaleString()} />
              <Info label="Address" value={viewing.address || "—"} className="sm:col-span-2" />
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Items</h4>
              <div className="rounded-lg border border-border divide-y divide-border">
                {(viewing.items ?? []).map((it) => (
                  <div key={it.id} className="px-4 py-2.5 flex items-center justify-between text-sm">
                    <div>
                      <div className="font-medium">{it.product_name}</div>
                      <div className="text-xs text-muted-foreground">
                        ${Number(it.unit_price).toFixed(2)} × {it.quantity}
                      </div>
                    </div>
                    <div className="font-semibold">
                      ${(Number(it.unit_price) * it.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-2 text-sm border-t border-border pt-4">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="text-right">${Number(viewing.subtotal).toFixed(2)}</dd>
              <dt className="text-muted-foreground">Shipping</dt>
              <dd className="text-right">${Number(viewing.shipping).toFixed(2)}</dd>
              <dt className="text-muted-foreground">Tax</dt>
              <dd className="text-right">${Number(viewing.tax).toFixed(2)}</dd>
              <dt className="font-semibold">Total</dt>
              <dd className="text-right font-bold gradient-text text-lg">
                ${Number(viewing.total).toFixed(2)}
              </dd>
            </dl>

            <div className="flex items-end gap-3 pt-2 border-t border-border">
              <div className="flex-1">
                <AdminSelect
                  label="Status"
                  options={STATUSES}
                  value={statusEdit}
                  onChange={(e) => setStatusEdit(e.target.value)}
                />
              </div>
              <AdminButton onClick={updateStatus}>Update</AdminButton>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}

function Info({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}
