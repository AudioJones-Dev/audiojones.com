import "server-only";

import {
  STOREFRONT_API_BASE,
  fourthwallPublic,
  isStorefrontConfigured,
} from "./config";
import type {
  FourthwallCart,
  FourthwallCollection,
  FourthwallList,
  FourthwallProduct,
} from "./types";

/**
 * Server-side Fourthwall Storefront API client.
 *
 * Reads are unauthenticated beyond the publishable `storefront_token` query
 * param. Everything degrades to empty/null when the integration is not
 * configured, so pages and the build never fail on missing env.
 */

function withToken(path: string, params: Record<string, string> = {}): string {
  const url = new URL(STOREFRONT_API_BASE + path);
  url.searchParams.set("storefront_token", fourthwallPublic.storefrontToken);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return url.toString();
}

async function fwGet<T>(path: string, params?: Record<string, string>): Promise<T | null> {
  if (!isStorefrontConfigured()) return null;
  try {
    const res = await fetch(withToken(path, params), {
      headers: { Accept: "application/json" },
      // Storefront catalog changes rarely; revalidate hourly.
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.warn(`[fourthwall] GET ${path} → ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[fourthwall] GET ${path} failed`, err);
    return null;
  }
}

export async function getCollections(): Promise<FourthwallCollection[]> {
  const data = await fwGet<FourthwallList<FourthwallCollection>>("/collections");
  return data?.results ?? [];
}

export async function getCollectionProducts(slug: string): Promise<FourthwallProduct[]> {
  const data = await fwGet<FourthwallList<FourthwallProduct>>(
    `/collections/${encodeURIComponent(slug)}/products`,
  );
  return data?.results ?? [];
}

/** All products across every collection, de-duplicated by id. */
export async function getAllProducts(): Promise<FourthwallProduct[]> {
  const collections = await getCollections();
  const lists = await Promise.all(collections.map((c) => getCollectionProducts(c.slug)));
  const byId = new Map<string, FourthwallProduct>();
  for (const product of lists.flat()) byId.set(product.id, product);
  return [...byId.values()];
}

export async function getProductBySlug(slug: string): Promise<FourthwallProduct | null> {
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

/**
 * Create a cart with the given variants, returning the hosted-checkout URL.
 * The supporter completes payment on Fourthwall's hosted checkout.
 */
export async function createCartCheckoutUrl(
  items: { variantId: string; quantity: number }[],
): Promise<string | null> {
  if (!isStorefrontConfigured() || items.length === 0) return null;
  try {
    const res = await fetch(withToken("/carts"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) {
      console.warn(`[fourthwall] POST /carts → ${res.status}`);
      return null;
    }
    const cart = (await res.json()) as FourthwallCart;
    if (!cart.id) return null;
    const base = fourthwallPublic.checkoutUrl;
    if (!base) return null;
    // Redirect to Fourthwall's hosted checkout for the created cart.
    return `${base}/checkout/?cartId=${encodeURIComponent(cart.id)}`;
  } catch (err) {
    console.warn(`[fourthwall] createCart failed`, err);
    return null;
  }
}

export function formatMoney(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}
