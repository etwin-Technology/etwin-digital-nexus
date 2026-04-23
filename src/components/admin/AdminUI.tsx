import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Loader2, X } from "lucide-react";

export function AdminModal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border shadow-2xl">
        <div className="sticky top-0 bg-card/95 backdrop-blur-md flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function AdminInput({
  label,
  ...rest
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        {...rest}
        className={`mt-1.5 w-full rounded-lg bg-input/50 border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors ${rest.className ?? ""}`}
      />
    </label>
  );
}

export function AdminTextarea({
  label,
  ...rest
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <textarea
        {...rest}
        className={`mt-1.5 w-full rounded-lg bg-input/50 border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors resize-y ${rest.className ?? ""}`}
      />
    </label>
  );
}

export function AdminSelect({
  label,
  options,
  ...rest
}: { label: string; options: string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <select
        {...rest}
        className={`mt-1.5 w-full rounded-lg bg-input/50 border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors ${rest.className ?? ""}`}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AdminButton({
  loading,
  children,
  variant = "primary",
  ...rest
}: {
  loading?: boolean;
  variant?: "primary" | "secondary" | "destructive";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:opacity-90"
      : variant === "destructive"
        ? "bg-destructive text-destructive-foreground hover:opacity-90"
        : "border border-border hover:bg-muted";
  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all disabled:opacity-50 ${styles} ${rest.className ?? ""}`}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function DataTable<T>({
  columns,
  rows,
  loading,
  empty,
}: {
  columns: { key: keyof T | string; label: string; render?: (row: T) => ReactNode; className?: string }[];
  rows: T[];
  loading?: boolean;
  empty?: string;
}) {
  if (loading) {
    return (
      <div className="rounded-xl border border-border overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 bg-card border-b border-border last:border-b-0 animate-pulse" />
        ))}
      </div>
    );
  }
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
        {empty ?? "No data yet."}
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-border bg-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            {columns.map((c) => (
              <th
                key={String(c.key)}
                className={`text-left font-semibold px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground ${c.className ?? ""}`}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors">
              {columns.map((c) => (
                <td key={String(c.key)} className={`px-4 py-3 ${c.className ?? ""}`}>
                  {c.render ? c.render(row) : ((row as any)[c.key] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function useFormState<T>(initial: T) {
  const [state, setState] = useState<T>(initial);
  useEffect(() => setState(initial), [initial]);
  const update = (patch: Partial<T>) => setState((s) => ({ ...s, ...patch }));
  return { state, setState, update };
}

export function FeaturesField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [text, setText] = useState(value.join(", "));
  useEffect(() => setText(value.join(", ")), [value]);
  return (
    <AdminTextarea
      label={`${label} (comma separated)`}
      value={text}
      rows={2}
      onChange={(e) => {
        setText(e.target.value);
        onChange(
          e.target.value
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        );
      }}
    />
  );
}

export type SubmitHandler = (e: FormEvent) => void | Promise<void>;
