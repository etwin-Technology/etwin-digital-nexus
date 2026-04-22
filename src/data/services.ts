import { Code2, ShoppingBag, Cloud, Smartphone, Sparkles, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Service = {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  features: string[];
};

export const services: Service[] = [
  {
    id: "web-development",
    title: "Website Development",
    icon: Code2,
    description:
      "Custom-built, blazing-fast websites engineered with modern frameworks and pixel-perfect design.",
    features: ["React / Next.js", "SEO optimized", "CMS Integration"],
  },
  {
    id: "ecommerce",
    title: "eCommerce Stores",
    icon: ShoppingBag,
    description:
      "End-to-end online stores with secure checkout, smart inventory, and conversion-focused UX.",
    features: ["Stripe & Paddle", "Inventory Sync", "Analytics Dashboard"],
  },
  {
    id: "saas",
    title: "SaaS Solutions",
    icon: Cloud,
    description:
      "Scalable software platforms with auth, billing, and dashboards — ready to ship from day one.",
    features: ["Multi-tenant", "Subscription Billing", "Cloud Native"],
  },
  {
    id: "mobile",
    title: "Mobile Apps",
    icon: Smartphone,
    description:
      "Native-feel iOS and Android apps that look stunning and perform like a dream.",
    features: ["React Native", "Push Notifications", "Offline-first"],
  },
  {
    id: "ai",
    title: "AI Integrations",
    icon: Sparkles,
    description:
      "Plug intelligent automation, chat, and recommendation systems into your existing products.",
    features: ["LLM Integrations", "Custom Agents", "Vector Search"],
  },
  {
    id: "security",
    title: "Security & DevOps",
    icon: ShieldCheck,
    description:
      "Hardening, monitoring, and CI/CD pipelines that keep your platform fast and bulletproof.",
    features: ["Penetration Testing", "CI/CD", "24/7 Monitoring"],
  },
];
