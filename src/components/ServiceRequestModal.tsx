import { useState, type FormEvent } from "react";
import { Loader2, X, Send } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Service } from "@/data/services";

export function ServiceRequestModal({
  service,
  onClose,
}: {
  service: Service | null;
  onClose: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");

  if (!service) return null;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/service-request", {
        service_id: service.id,
        name,
        email,
        budget,
        message,
      });
      toast.success("Request sent! We'll be in touch shortly.");
      setName(""); setEmail(""); setBudget(""); setMessage("");
      onClose();
    } catch (err: any) {
      toast.error(err?.message ?? "Could not send request. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl glass-strong border border-border shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="text-lg font-semibold">Request {service.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tell us about your project — we'll reply within 24h.
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <Field label="Your name" value={name} onChange={setName} required />
          <Field label="Email" type="email" value={email} onChange={setEmail} required />
          <Field label="Budget (optional)" value={budget} onChange={setBudget} placeholder="e.g. $5k–$10k" />
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              Project details
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Goals, timelines, links…"
              className="mt-2 w-full rounded-xl bg-input/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary/60 transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-5px_var(--primary)] hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-60 disabled:hover:scale-100"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {submitting ? "Sending…" : "Send request"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl bg-input/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary/60 transition-colors"
      />
    </div>
  );
}
