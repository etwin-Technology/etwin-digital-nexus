import { Link } from "@tanstack/react-router";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/digital", label: "Digital" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong shadow-[0_8px_30px_-10px_rgba(0,0,0,0.5)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-highlight text-primary-foreground font-bold text-sm shadow-[0_0_20px_-5px_var(--primary)]">
            e
          </span>
          <span className="text-lg font-semibold tracking-tight">
            e<span className="gradient-text">Twin</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="relative px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors data-[status=active]:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
              <span className="absolute bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-primary transition-all duration-300 group-hover:w-6" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full glass hover:bg-primary/10 hover:border-primary/40 transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart className="h-4 w-4" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>
          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full glass"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden glass-strong border-t border-border"
          >
            <nav className="flex flex-col px-4 py-4">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 text-sm text-muted-foreground hover:text-foreground"
                  activeProps={{ className: "text-foreground" }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
