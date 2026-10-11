import Link from "next/link";
import type { Product } from "@/types/product";
import { formatBengaliNumber } from "@/lib/products";
export default function ProductCard({ product }: { product: Product }) {
  const cls = product.change > 0 ? "change down" : product.change < 0 ? "change up" : "change flat";
  const symbol = product.change > 0 ? "▲" : product.change < 0 ? "▼" : "—";
  return <Link className="product-card" href={`/product/${product.slug}`}><div className="product-top"><span className="product-emoji">{product.emoji}</span><span className="product-name-wrap"><b>{product.name}</b><small>{product.unit}</small></span></div><div className="price-bottom"><div><small>আজকের দাম</small><strong>{formatBengaliNumber(product.price)} টাকা</strong></div><span className={cls}>{symbol} {formatBengaliNumber(Math.abs(product.change))}%</span></div></Link>;
}
