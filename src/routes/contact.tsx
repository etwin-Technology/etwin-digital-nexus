import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — eTwin" },
      {
        name: "description",
        content: "Get in touch with eTwin for products, services, or partnerships.",
      },
      { property: "og:title", content: "Contact — eTwin" },
      { property: "og:description", content: "Reach out to the eTwin team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <SectionHeading
        eyebrow="Get in touch"
        title={
          <>
            Let's <span className="gradient-text">build</span> together.
          </>
        }
        description="Whether you need hardware support or a new digital product, the eTwin team is ready."
      />

      <div className="mt-14 grid lg:grid-cols-[380px_1fr] gap-8">
        <div className="space-y-4">
          {[
            { icon: Mail, label: "Email", value: "hello@etwin.io" },
            { icon: Phone, label: "Phone", value: "+1 (555) 010-2024" },
            { icon: MapPin, label: "Office", value: "Lisbon · Remote-first" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass rounded-2xl p-5 flex items-start gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {label}
                </div>
                <div className="mt-1 font-medium">{value}</div>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="glass-strong rounded-2xl p-7 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" name="name" placeholder="Jane Doe" />
            <Field label="Email" name="email" type="email" placeholder="jane@company.com" />
          </div>
          <Field label="Subject" name="subject" placeholder="How can we help?" />
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              Message
            </label>
            <textarea
              required
              rows={6}
              placeholder="Tell us about your project…"
              className="mt-2 w-full rounded-xl bg-input/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary/60 focus:bg-input/80 transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-5px_var(--primary)] hover:scale-[1.03] transition-transform"
          >
            {sent ? "Sent ✓" : (
              <>
                Send message <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl bg-input/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary/60 focus:bg-input/80 transition-colors"
      />
    </div>
  );
}
