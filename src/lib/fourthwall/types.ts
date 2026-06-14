/**
 * Fourthwall Storefront API types.
 * Mirrors the shapes returned by https://storefront-api.fourthwall.com/v1
 * (field names match Fourthwall's official vercel-commerce reference).
 */

export type FourthwallMoney = {
  value: number;
  currency: string;
};

export type FourthwallProductImage = {
  id: string;
  url: string;
  transformedUrl?: string;
  width: number;
  height: number;
};

export type FourthwallProductVariant = {
  id: string;
  name: string;
  sku: string;
  unitPrice: FourthwallMoney;
  images: FourthwallProductImage[];
  stock?: {
    type: "UNLIMITED" | "LIMITED";
    inStock?: number;
  };
  attributes?: {
    description?: string;
    color?: { name: string; swatch?: string };
    size?: { name: string };
  };
};

export type FourthwallProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: FourthwallProductImage[];
  variants: FourthwallProductVariant[];
  updatedAt?: string;
};

export type FourthwallCollection = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  updatedAt?: string;
};

export type FourthwallCart = {
  id: string;
  items?: { variant: FourthwallProductVariant; quantity: number }[];
};

/** A list response from the storefront API: `{ results: [...] }`. */
export type FourthwallList<T> = { results: T[] };
