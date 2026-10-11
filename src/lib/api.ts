import { categories as fallbackCategories, products as fallbackProducts } from '@/lib/products';
import type { Category, Product } from '@/types/product';

const base = (
  process.env.BAZARDOR_API_BASE || 'https://api.api-store.workers.dev/api/bazardor'
).replace(/\/$/, '');
async function request(path: string) {
  const urls = [base, 'https://api.abcz.workers.dev/api/bazardor'].filter(
    (v, i, a) => a.indexOf(v) === i
  );
  for (const url of urls) {
    try {
      const response = await fetch(`${url}${path}`, {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) return await response.json();
    } catch {
      /* try alternative API, then use local fallback */
    }
  }
  return null;
}
function unwrap<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    const o = data as Record<string, unknown>;
    for (const key of ['data', 'products', 'categories', 'items', 'results'])
      if (Array.isArray(o[key])) return o[key] as T[];
  }
  return [];
}
function normalizeProduct(raw: any, i: number): Product | null {
  if (!raw || typeof raw !== 'object') return null;
  const name = String(raw.name ?? raw.title ?? raw.product_name ?? '');
  if (!name) return null;
  const slug = String(raw.slug ?? raw.id ?? name.toLowerCase().replace(/\s+/g, '-'));
  const category = String(
    raw.category?.slug ?? raw.category_slug ?? raw.category ?? 'sobji'
  ).toLowerCase();
  const local = fallbackProducts.find((p) => p.slug === slug || p.name === name);
  const numeric = Number(
    raw.price ?? raw.current_price ?? raw.today_price ?? raw.amount ?? local?.price ?? 0
  );
  const change = Number(
    raw.change ?? raw.percentage_change ?? raw.price_change ?? local?.change ?? 0
  );
  return {
    ...(local ?? fallbackProducts[i % fallbackProducts.length]),
    id: raw.id ?? i + 1,
    slug,
    name,
    category,
    categoryName: String(
      raw.category?.name ?? raw.category_name ?? local?.categoryName ?? 'অন্যান্য'
    ),
    emoji: String(raw.emoji ?? local?.emoji ?? '🛒'),
    unit: String(raw.unit ?? raw.measurement ?? local?.unit ?? 'প্রতি কেজি'),
    price: Number.isFinite(numeric) ? numeric : 0,
    change: Number.isFinite(change) ? change : 0,
  };
}
export async function getProducts(): Promise<Product[]> {
  const data = await request('/products');
  const rows = unwrap<any>(data).map(normalizeProduct).filter(Boolean) as Product[];
  return rows.length ? rows : fallbackProducts;
}
export async function getCategories(): Promise<Category[]> {
  const data = await request('/categories');
  const rows = unwrap<any>(data)
    .map((c: any) => ({
      slug: String(c.slug ?? c.id ?? c.key ?? ''),
      name: String(c.name ?? c.title ?? ''),
      emoji: String(c.emoji ?? fallbackCategories.find((x) => x.slug === c.slug)?.emoji ?? '🛒'),
    }))
    .filter((c) => c.slug && c.name);
  return rows.length ? rows : fallbackCategories;
}
export async function getProduct(slug: string) {
  const list = await getProducts();
  const fromList = list.find((p) => p.slug === slug || String(p.id) === slug);
  if (fromList) {
    const data = await request(`/products/${encodeURIComponent(slug)}`);
    const raw = data && (data.data ?? data.product ?? data);
    if (raw && typeof raw === 'object' && (raw.name || raw.title))
      return normalizeProduct(raw, 0) ?? fromList;
    return fromList;
  }
  const data = await request(`/products/${encodeURIComponent(slug)}`);
  const raw = data && (data.data ?? data.product ?? data);
  return raw ? normalizeProduct(raw, 0) : undefined;
}
