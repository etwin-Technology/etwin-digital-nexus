/**
 * Central API client for the eTwin PHP backend.
 *
 * Configure the URL with VITE_API_URL in .env.
 * If it's missing or wrong, the client will auto-try common local URLs used by
 * Laragon / XAMPP / MAMP, including project subfolders.
 * All requests use credentials: "include" so the admin PHP session cookie travels.
 */

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function buildApiBaseCandidates() {
  const candidates = new Set<string>();
  const envUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();

  if (envUrl) {
    candidates.add(trimTrailingSlash(envUrl));
  }

  if (typeof window !== "undefined") {
    const { origin, pathname } = window.location;
    const segments = pathname.split("/").filter(Boolean);

    for (let index = segments.length; index >= 0; index -= 1) {
      const prefix = segments.slice(0, index).join("/");
      const basePath = prefix ? `/${prefix}` : "";

      candidates.add(trimTrailingSlash(`${origin}${basePath}/backend/api`));
      candidates.add(trimTrailingSlash(`${origin}${basePath}/api`));
    }
  } else {
    candidates.add("/backend/api");
    candidates.add("/api");
  }

  return [...candidates];
}

export let API_URL = buildApiBaseCandidates()[0] ?? "/backend/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const requestPath = path.startsWith("/") ? path : `/${path}`;
  const apiBases = [API_URL, ...buildApiBaseCandidates().filter((candidate) => candidate !== API_URL)];
  let lastError: ApiError | null = null;

  for (const baseUrl of apiBases) {
    try {
      const res = await fetch(`${baseUrl}${requestPath}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(init.headers ?? {}),
        },
        ...init,
      });

      let body: any = null;
      const text = await res.text();
      try {
        body = text ? JSON.parse(text) : null;
      } catch {
        body = { error: text };
      }

      if (res.ok) {
        API_URL = baseUrl;
        return body as T;
      }

      const error = new ApiError(body?.error ?? `Request failed (${res.status})`, res.status);

      if (res.status === 404) {
        lastError = error;
        continue;
      }

      API_URL = baseUrl;
      throw error;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof TypeError) {
        lastError = new ApiError(
          "Could not reach the PHP API. If you use Laragon, open the app on your local domain and set VITE_API_URL to your backend URL.",
          0,
        );
        continue;
      }

      throw error;
    }
  }

  throw (
    lastError ??
    new ApiError(
      "Could not reach the PHP API. Check your Laragon URL and VITE_API_URL.",
      0,
    )
  );
}

export const api = {
  get:    <T>(p: string) => request<T>(p),
  post:   <T>(p: string, data?: any) => request<T>(p, { method: "POST", body: JSON.stringify(data ?? {}) }),
  put:    <T>(p: string, data?: any) => request<T>(p, { method: "PUT", body: JSON.stringify(data ?? {}) }),
  delete: <T>(p: string) => request<T>(p, { method: "DELETE" }),
};

// ---------- Types ----------
export type ApiProduct = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  highlights: string[];
  stock: number;
  created_at?: string;
};

export type ApiDigitalProduct = {
  id: string;
  name: string;
  type: string;
  price: number;
  old_price: number | null;
  rating: number;
  sales: number;
  tagline: string;
  features: string[];
  badge: string | null;
  download_url: string | null;
  created_at?: string;
};

export type ApiService = {
  id: string;
  title: string;
  icon: string;
  description: string;
  features: string[];
  created_at?: string;
};

export type ApiOrder = {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  address: string | null;
  subtotal: string | number;
  shipping: string | number;
  tax: string | number;
  total: string | number;
  status: string;
  created_at: string;
  item_count?: number;
  items?: Array<{
    id: number;
    product_id: string;
    product_name: string;
    unit_price: string | number;
    quantity: number;
  }>;
};

export type ApiMessage = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: number;
  created_at: string;
};

export type ApiServiceRequest = {
  id: number;
  service_id: string;
  name: string;
  email: string;
  budget: string | null;
  message: string | null;
  is_read: number;
  created_at: string;
};

export type ApiStats = {
  stats: {
    products: number;
    digital_products: number;
    services: number;
    orders: number;
    orders_pending: number;
    revenue: number;
    messages_unread: number;
    requests_unread: number;
  };
  revenue_chart: Array<{ day: string; total: string | number }>;
  recent_orders: Array<{
    id: number;
    customer_name: string;
    total: string | number;
    status: string;
    created_at: string;
  }>;
};

export type Admin = { id: number; username: string; name: string };
