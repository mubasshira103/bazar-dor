'use client';
import { useMemo, useState } from 'react';
import type { Product } from '@/types/product';
import ProductGrid from '@/components/ProductGrid';
export default function SortProducts({ items }: { items: Product[] }) {
  const [sort, setSort] = useState('default');
  const sorted = useMemo(
    () =>
      [...items].sort((a, b) =>
        sort === 'asc' ? a.price - b.price : sort === 'desc' ? b.price - a.price : 0
      ),
    [items, sort]
  );
  return (
    <>
      <div className="sort-row">
        <span>মোট {new Intl.NumberFormat('bn-BD').format(items.length)}টি পণ্য দেখানো হচ্ছে</span>
        <label>
          সাজান{' '}
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">ডিফল্ট</option>
            <option value="asc">দাম: কম থেকে বেশি</option>
            <option value="desc">দাম: বেশি থেকে কম</option>
          </select>
        </label>
      </div>
      <ProductGrid items={sorted} />
    </>
  );
}
