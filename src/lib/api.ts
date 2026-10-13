import type { Product, Category } from '@/types/product';

const API = 'https://openapi.programming-hero.com/api/bazardor';

async function fetchData(path: string) {
  try {
    const response = await fetch(`${API}${path}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('API fetch error:', error);
    return null;
  }
}

function unwrap(data: unknown, key: string): any[] {
  if (Array.isArray(data)) return data;

  if (typeof data !== 'object' || data === null) {
    return [];
  }

  const result = data as Record<string, any>;

  if (Array.isArray(result.data)) return result.data;
  if (Array.isArray(result[key])) return result[key];

  if (typeof result.data === 'object' && result.data !== null && Array.isArray(result.data[key])) {
    return result.data[key];
  }

  return [];
}

function normalizeProduct(raw: any): Product {
  const today = Number(raw.today ?? raw.price ?? 0);
  const yesterday = Number(raw.yesterday ?? today);

  const change =
    typeof raw.change?.pct === 'number'
      ? raw.change.pct
      : yesterday > 0
        ? Number((((today - yesterday) / yesterday) * 100).toFixed(1))
        : 0;

  const markets = Array.isArray(raw.markets)
    ? raw.markets.map((market: any) => {
        const min = Number(market.min ?? 0);
        const max = Number(market.max ?? 0);

        return {
          name: String(market.market ?? market.name ?? ''),
          district: String(market.division ?? market.district ?? ''),
          min,
          max,
          price: Number(market.price ?? (min + max) / 2),
        };
      })
    : [];

  const marketMins = markets.map((market: any) => market.min);
  const marketMaxs = markets.map((market: any) => market.max);

  return {
    id: raw.id,
    slug: String(raw.slug ?? raw.id),
    name: String(raw.nameBn ?? raw.name ?? raw.title ?? ''),
    category: String(raw.category?.slug ?? raw.category ?? raw.category_slug ?? ''),
    categoryName: String(
      raw.categoryNameBn ?? raw.categoryName ?? raw.category_name ?? raw.categoryBn ?? ''
    ),
    emoji: String(raw.image ?? raw.categoryIcon ?? raw.emoji ?? '🛒'),
    unit: String(raw.unit ?? 'কেজি'),
    price: Number.isFinite(today) ? today : 0,
    change,
    description: String(raw.description ?? ''),
    minPrice: marketMins.length ? Math.min(...marketMins) : today,
    maxPrice: marketMaxs.length ? Math.max(...marketMaxs) : today,
    averagePrice: markets.length
      ? Number(
          (
            markets.reduce((sum: number, market: any) => sum + market.price, 0) / markets.length
          ).toFixed(2)
        )
      : today,
    markets,
  } as Product;
}

export async function getProducts(category?: string): Promise<Product[]> {
  const path = category ? `/products?category=${encodeURIComponent(category)}` : '/products';

  const result = await fetchData(path);

  return unwrap(result, 'products').map(normalizeProduct);
}

export async function getCategories(): Promise<Category[]> {
  const result = await fetchData('/categories');

  return unwrap(result, 'categories').map((item: any) => ({
    slug: String(item.slug ?? item.id ?? ''),
    name: String(item.nameBn ?? item.name ?? item.title ?? ''),
    emoji: String(item.icon ?? item.emoji ?? '🛒'),
  }));
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const products = await getProducts();

  return products.find((product) => product.slug === slug || String(product.id) === slug);
}
