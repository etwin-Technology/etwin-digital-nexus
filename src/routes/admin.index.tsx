import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Package,
  Boxes,
  ShoppingCart,
  Wrench,
  DollarSign,
  Mail,
  Inbox,
  TrendingUp,
} from "lucide-react";
import { api, type ApiStats } from "@/lib/api";
import { PageHeader, DataTable } from "@/components/admin/AdminUI";

export const Route = createFileRoute("/admin/")({
  component: DashboardPage,
});

const fmt = (n: number | string) =>
  Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function DashboardPage() {
  const [data, setData] = useState<ApiStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<ApiStats>("/stats")
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Revenue", value: data ? fmt(data.stats.revenue) : "—", icon: DollarSign, color: "from-emerald-500/30 to-primary/20" },
    { label: "Orders", value: data?.stats.orders ?? "—", icon: ShoppingCart, color: "from-primary/30 to-highlight/20" },
    { label: "Pending", value: data?.stats.orders_pending ?? "—", icon: TrendingUp, color: "from-amber-500/30 to-primary/20" },
    { label: "Products", value: data?.stats.products ?? "—", icon: Package, color: "from-blue-500/30 to-primary/20" },
    { label: "Digital", value: data?.stats.digital_products ?? "—", icon: Boxes, color: "from-purple-500/30 to-highlight/20" },
    { label: "Services", value: data?.stats.services ?? "—", icon: Wrench, color: "from-pink-500/30 to-primary/20" },
    { label: "Messages", value: data?.stats.messages_unread ?? "—", icon: Mail, color: "from-cyan-500/30 to-primary/20" },
    { label: "Requests", value: data?.stats.requests_unread ?? "—", icon: Inbox, color: "from-orange-500/30 to-highlight/20" },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Live overview of your eTwin store." />

      {error && (
        <div className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load stats: {error}. Make sure the PHP backend is running and{" "}
          <code>VITE_API_URL</code> is set correctly.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className={`relative overflow-hidden rounded-2xl border border-border p-5 bg-gradient-to-br ${c.color}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {c.label}
                  </div>
                  <div className="mt-2 text-2xl font-bold">
                    {loading ? <span className="inline-block h-7 w-16 bg-muted/50 rounded animate-pulse" /> : c.value}
                  </div>
                </div>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-background/40 backdrop-blur text-primary">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold mb-4">Revenue · Last 7 days</h3>
          {data && data.revenue_chart.length > 0 ? (
            <RevenueChart data={data.revenue_chart} />
          ) : (
            <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">
              {loading ? "Loading…" : "No revenue data yet."}
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold mb-4">Recent Orders</h3>
          <DataTable
            loading={loading}
            empty="No orders yet."
            rows={data?.recent_orders ?? []}
            columns={[
              { key: "id", label: "#", render: (r) => <span className="font-mono text-xs">#{r.id}</span> },
              { key: "customer_name", label: "Customer" },
              {
                key: "total",
                label: "Total",
                render: (r) => <span className="font-semibold">{fmt(r.total)}</span>,
              },
              {
                key: "status",
                label: "Status",
                render: (r) => <StatusBadge status={r.status} />,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function RevenueChart({ data }: { data: Array<{ day: string; total: string | number }> }) {
  const max = Math.max(...data.map((d) => Number(d.total)), 1);
  return (
    <div className="flex items-end justify-between gap-2 h-40">
      {data.map((d) => {
        const h = (Number(d.total) / max) * 100;
        return (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
            <div className="text-[10px] text-muted-foreground">${Math.round(Number(d.total))}</div>
            <div
              className="w-full rounded-t bg-gradient-to-t from-primary to-highlight transition-all"
              style={{ height: `${Math.max(h, 4)}%` }}
            />
            <div className="text-[10px] text-muted-foreground">
              {new Date(d.day).toLocaleDateString("en-US", { weekday: "short" })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    paid: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    shipped: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    completed: "bg-primary/15 text-primary border-primary/30",
    cancelled: "bg-destructive/15 text-destructive border-destructive/30",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider ${map[status] ?? "bg-muted text-muted-foreground border-border"}`}
    >
      {status}
    </span>
  );
}
