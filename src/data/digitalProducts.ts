import { Layout, Boxes, Bot, Database, ShoppingCart, LineChart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type DigitalProduct = {
  id: string;
  name: string;
  type: "Website Template" | "WordPress Theme" | "Chatbot Module" | "Odoo Module" | "Shopify Theme" | "Dashboard Kit";
  price: number;
  oldPrice?: number;
  rating: number;
  sales: number;
  icon: LucideIcon;
  tagline: string;
  features: string[];
  badge?: "Bestseller" | "New" | "Pro";
  gradient: string;
};

export const digitalProducts: DigitalProduct[] = [
  {
    id: "nova-saas-template",
    name: "Nova SaaS Template",
    type: "Website Template",
    price: 49,
    oldPrice: 79,
    rating: 4.9,
    sales: 1240,
    icon: Layout,
    tagline: "Production-ready Next.js + Tailwind SaaS landing template.",
    features: ["Next.js 14", "10+ sections", "Dark mode", "Lifetime updates"],
    badge: "Bestseller",
    gradient: "from-primary/30 to-highlight/20",
  },
  {
    id: "aurora-wp-theme",
    name: "Aurora WordPress Theme",
    type: "WordPress Theme",
    price: 59,
    rating: 4.8,
    sales: 860,
    icon: Boxes,
    tagline: "Premium WordPress theme for agencies and creators.",
    features: ["Elementor ready", "WooCommerce", "Speed optimized", "RTL support"],
    badge: "New",
    gradient: "from-blue-500/25 to-primary/20",
  },
  {
    id: "atlas-chatbot-module",
    name: "Atlas AI Chatbot Module",
    type: "Chatbot Module",
    price: 89,
    oldPrice: 129,
    rating: 5.0,
    sales: 410,
    icon: Bot,
    tagline: "Plug-and-play GPT chatbot with multi-channel support.",
    features: ["OpenAI + Gemini", "WhatsApp & Web", "Custom training", "Analytics"],
    badge: "Pro",
    gradient: "from-primary/30 to-emerald-500/20",
  },
  {
    id: "orbit-odoo-crm",
    name: "Orbit CRM — Odoo Module",
    type: "Odoo Module",
    price: 119,
    rating: 4.7,
    sales: 320,
    icon: Database,
    tagline: "Advanced CRM extension for Odoo 16/17 with pipeline AI.",
    features: ["Odoo 16 & 17", "AI lead scoring", "Email automation", "REST API"],
    gradient: "from-purple-500/25 to-highlight/20",
  },
  {
    id: "vertex-shopify-theme",
    name: "Vertex Shopify Theme",
    type: "Shopify Theme",
    price: 79,
    rating: 4.9,
    sales: 980,
    icon: ShoppingCart,
    tagline: "Conversion-optimized Shopify 2.0 theme for fashion & tech.",
    features: ["Shopify 2.0", "Mega menu", "Quick checkout", "Sections everywhere"],
    badge: "Bestseller",
    gradient: "from-pink-500/20 to-primary/20",
  },
  {
    id: "pulse-dashboard-kit",
    name: "Pulse Admin Dashboard Kit",
    type: "Dashboard Kit",
    price: 39,
    oldPrice: 69,
    rating: 4.8,
    sales: 1530,
    icon: LineChart,
    tagline: "120+ React + Tailwind admin components and pages.",
    features: ["120+ components", "Charts & tables", "Auth flows", "Figma file"],
    badge: "New",
    gradient: "from-highlight/30 to-primary/20",
  },
];
