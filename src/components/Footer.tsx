import { Link } from "@tanstack/react-router";
import { Github, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border bg-background/50">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-highlight text-primary-foreground font-bold text-sm">
              e
            </span>
            <span className="text-lg font-semibold">
              e<span className="gradient-text">Twin</span>
            </span>
          </Link>
          <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
            eTwin powers the digital world with premium electronics and bespoke digital
            services for ambitious teams.
          </p>
          <div className="mt-6 flex gap-2">
            {[Twitter, Github, Linkedin, Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full glass hover:border-primary/40 hover:text-primary transition-colors"
                aria-label="social"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-foreground">Shop</Link></li>
            <li><Link to="/digital" className="hover:text-foreground">Digital Services</Link></li>
            <li><Link to="/cart" className="hover:text-foreground">Cart</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>About</li>
            <li>Careers</li>
            <li>Press</li>
            <li>Privacy</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-6 flex flex-col md:flex-row justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} eTwin. Crafted with precision.</span>
          <span>Power your digital world.</span>
        </div>
      </div>
    </footer>
  );
}
