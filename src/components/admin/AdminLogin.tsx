import { useState, type FormEvent } from "react";
import { Lock, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/context/AdminAuthContext";

export function AdminLogin() {
  const { login } = useAdminAuth();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      toast.success("Welcome back!");
    } catch (err: any) {
      toast.error(err?.message ?? "Login failed. Is the PHP backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-highlight text-primary-foreground font-bold text-xl shadow-[0_0_30px_-5px_var(--primary)]">
            e
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight">
            eTwin <span className="gradient-text">Admin</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to manage your store</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="glass-strong rounded-2xl p-7 space-y-4 border border-border"
        >
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              Username
            </label>
            <div className="mt-1.5 relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full rounded-lg bg-input/50 border border-border pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary/60"
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <div className="mt-1.5 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg bg-input/50 border border-border pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary/60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-5px_var(--primary)] hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
          </button>

          <div className="pt-2 text-center text-xs text-muted-foreground border-t border-border">
            Default: <span className="text-foreground font-mono">admin / admin123</span>
          </div>
        </form>
      </div>
    </div>
  );
}
