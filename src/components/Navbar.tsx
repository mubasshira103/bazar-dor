'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories, products, formatBengaliNumber } from '@/lib/products';
import { ShoppingBasket } from 'lucide-react';
export default function Navbar() {
  const pathname = usePathname();
  const ticker = [...products, ...products];
  return (
    <header className="site-header">
      <div className="topbar container">
        <Link href="/" className="brand">
          <span className="brand-icon">
            <ShoppingBasket size={24} />
          </span>
          <span>
            <b>বাজার দর</b>
            <small>শনিবার, ১০ অক্টোবর, ২০২৬</small>
          </span>
        </Link>
        <div className="auth-actions">
          <Link className="signin-link" href="/signin">
            সাইন ইন
          </Link>
          <Link className="btn btn-primary btn-small" href="/signup">
            সাইন আপ
          </Link>
        </div>
      </div>
      <nav className="category-nav">
        <div className="container nav-links">
          <Link className={pathname === '/' ? 'nav-link active' : 'nav-link'} href="/">
            ⌂ <span>হোম</span>
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              className={pathname === `/category/${c.slug}` ? 'nav-link active' : 'nav-link'}
              href={`/category/${c.slug}`}
            >
              {c.emoji} <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </nav>
      <div className="ticker">
        <div className="ticker-track">
          {ticker.map((p, i) => (
            <span className="ticker-item" key={`${p.slug}-${i}`}>
              {p.emoji} {p.name}{' '}
              <b>
                {formatBengaliNumber(p.price)} টাকা/{p.unit.replace('প্রতি ', '')}
              </b>{' '}
              <i className={p.change > 0 ? 'up' : p.change < 0 ? 'down' : 'flat'}>
                {p.change > 0 ? '▲' : p.change < 0 ? '▼' : '—'}{' '}
                {formatBengaliNumber(Math.abs(p.change))}%
              </i>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
