import Link from 'next/link';
import type { Product } from '@/types/product';

function formatBengaliNumber(value: number) {
  return new Intl.NumberFormat('bn-BD', {
    maximumFractionDigits: 1,
  }).format(value);
}

export default function ProductCard({ product }: { product: Product }) {
  const change = Number(product.change) || 0;

  const cls = change > 0 ? 'change up' : change < 0 ? 'change down' : 'change flat';

  const symbol = change > 0 ? '▲' : change < 0 ? '▼' : '—';

  return (
    <Link className="product-card" href={`/product/${product.slug}`}>
      <div className="product-top">
        <span className="product-emoji">{product.emoji}</span>

        <span className="product-name-wrap">
          <b>{product.name}</b>
          <small>{{
      kg: 'প্রতি কেজি',
      liter: 'প্রতি লিটার',
      piece: 'প্রতি পিস',
      pcs: 'প্রতি পিস',
      dozen: 'প্রতি ডজন',
    }[product.unit.toLowerCase()] || product.unit}</small>
        </span>
      </div>

      <div className="price-bottom">
        <div>
          <small>আজকের দাম</small>
          <strong>{formatBengaliNumber(product.price)} টাকা</strong>
        </div>

        <span className={cls}>
          {symbol} {formatBengaliNumber(Math.abs(change))}%
        </span>
      </div>
    </Link>
  );
}
