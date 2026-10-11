'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { categories, products, formatBengaliNumber } from '@/lib/products';
import { ShoppingBasket, UserRound, LogOut, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const [today, setToday] = useState('');

  const ticker = [...products, ...products];
  const user = session?.user;

  useEffect(() => {
    const date = new Intl.DateTimeFormat('bn-BD', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());

    setToday(date);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        return;
      }

      setMenuOpen(false);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="site-header">
      <div className="topbar container">
        <Link href="/" className="brand">
          <span className="brand-icon">
            <ShoppingBasket size={24} />
          </span>

          <span>
            <b>বাজার দর</b>
            <small>{today || 'তারিখ লোড হচ্ছে...'}</small>
          </span>
        </Link>

        <div className="auth-actions">
          {!isPending && !user && (
            <>
              <Link className="signin-link" href="/signin">
                সাইন ইন
              </Link>

              <Link className="btn btn-primary btn-small" href="/signup">
                সাইন আপ
              </Link>
            </>
          )}

          {!isPending && user && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full px-2 py-1"
                aria-expanded={menuOpen}
                aria-label="ইউজার মেনু"
              >
                {user.image ? (
                  <Image
                  width={40}
                  height={40}
                    src={user.image}
                    alt={user.name || 'User avatar'}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700">
                    <UserRound size={22} />
                  </span>
                )}

                <span className="max-w-28 truncate font-medium">
                  {user.name}
                </span>

                <ChevronDown size={16} />
              </button>

              {menuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="মেনু বন্ধ করুন"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setMenuOpen(false)}
                  />

                  <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-gray-200 bg-white p-2 text-gray-800 shadow-lg">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      <UserRound size={18} />
                      নিজের প্রোফাইল
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-red-600 hover:bg-gray-100"
                    >
                      <LogOut size={18} />
                      লগআউট
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <nav className="category-nav">
        <div className="container nav-links">
          <Link
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
            href="/"
          >
            ⌂ <span>হোম</span>
          </Link>

          {categories.map((c) => (
            <Link
              key={c.slug}
              className={
                pathname === `/category/${c.slug}`
                  ? 'nav-link active'
                  : 'nav-link'
              }
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
                {formatBengaliNumber(p.price)} টাকা/
                {p.unit.replace('প্রতি ', '')}
              </b>{' '}
              <i
                className={
                  p.change > 0 ? 'up' : p.change < 0 ? 'down' : 'flat'
                }
              >
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
