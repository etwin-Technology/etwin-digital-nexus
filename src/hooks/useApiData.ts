/**
 * Hooks that fetch real data from the PHP backend, with graceful fallback to
 * the bundled mock data so the cloud preview keeps working when the local
 * PHP API is unreachable.
 */
import { useQuery } from "@tanstack/react-query";
import { api, type ApiDigitalProduct, type ApiProduct, type ApiService } from "@/lib/api";
import { products as mockProducts, type Product } from "@/data/products";
import { digitalProducts as mockDigital, type DigitalProduct } from "@/data/digitalProducts";
import { services as mockServices, type Service } from "@/data/services";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=800&q=80";

function resolveIcon(name: string | undefined, fallback: LucideIcon): LucideIcon {
  if (!name) return fallback;
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[name];
  return Icon ?? fallback;
}

function normalizeCategory(c: string): Product["category"] {
  const allowed: Product["category"][] = ["Audio", "Wearables", "Computers", "Mobile", "Accessories"];
  return (allowed.includes(c as Product["category"]) ? c : "Accessories") as Product["category"];
}

function apiToProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    name: p.name,
    price: Number(p.price),
    category: normalizeCategory(p.category),
    image: p.image || FALLBACK_IMG,
    description: p.description,
    highlights: Array.isArray(p.highlights) ? p.highlights : [],
  };
}

function apiToDigital(p: ApiDigitalProduct): DigitalProduct {
  const type = (p.type as DigitalProduct["type"]) ?? "Website Template";
  const Icon = resolveIcon(undefined, Icons.Layout);
  return {
    id: p.id,
    name: p.name,
    type,
    price: Number(p.price),
    oldPrice: p.old_price ? Number(p.old_price) : undefined,
    rating: Number(p.rating ?? 5),
    sales: Number(p.sales ?? 0),
    icon: Icon,
    tagline: p.tagline,
    features: Array.isArray(p.features) ? p.features : [],
    badge: (p.badge as DigitalProduct["badge"]) ?? undefined,
    gradient: "from-primary/30 to-highlight/20",
    isFree: !!p.is_free || Number(p.price) === 0,
  };
}

function apiToService(s: ApiService): Service {
  return {
    id: s.id,
    title: s.title,
    icon: resolveIcon(s.icon, Icons.Sparkles),
    description: s.description,
    features: Array.isArray(s.features) ? s.features : [],
  };
}

/* -------------------- Public hooks -------------------- */

export function useProducts() {
  return useQuery({
    queryKey: ["public", "products"],
    queryFn: async (): Promise<Product[]> => {
      try {
        const data = await api.get<ApiProduct[]>("/products");
        if (!Array.isArray(data) || data.length === 0) return mockProducts;
        return data.map(apiToProduct);
      } catch {
        return mockProducts;
      }
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["public", "product", id],
    queryFn: async (): Promise<Product | null> => {
      try {
        const data = await api.get<ApiProduct>(`/products?id=${encodeURIComponent(id)}`);
        return apiToProduct(data);
      } catch {
        return mockProducts.find((p) => p.id === id) ?? null;
      }
    },
  });
}

export function useDigitalProducts() {
  return useQuery({
    queryKey: ["public", "digital-products"],
    queryFn: async (): Promise<DigitalProduct[]> => {
      try {
        const data = await api.get<ApiDigitalProduct[]>("/digital-products");
        if (!Array.isArray(data) || data.length === 0) return mockDigital;
        return data.map(apiToDigital);
      } catch {
        return mockDigital;
      }
    },
  });
}

export function useServices() {
  return useQuery({
    queryKey: ["public", "services"],
    queryFn: async (): Promise<Service[]> => {
      try {
        const data = await api.get<ApiService[]>("/services");
        if (!Array.isArray(data) || data.length === 0) return mockServices;
        return data.map(apiToService);
      } catch {
        return mockServices;
      }
    },
  });
}
