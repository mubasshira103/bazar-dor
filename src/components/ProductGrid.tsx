import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types/product';
export default function ProductGrid({ items }: { items: Product[] }) {
  if (!items.length)
    return (
      <div className="empty-state">
        <div>🧺</div>
        <h3>কোনো পণ্য পাওয়া যায়নি</h3>
        <p>অন্য ক্যাটাগরি নির্বাচন করে দেখুন।</p>
      </div>
    );
  return (
    <div className="product-grid">
      {items.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}
