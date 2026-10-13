
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { getCategories, getProducts } from '@/lib/api';
import {
  ShoppingBasket,
  UserRound,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';

type Category = {
  slug: string;
  name: string;
  emoji: string;
};

type Product = {
  id?: string | number;
  slug: string;
  name: string;
  emoji: string;
  price: number;
  unit: string;
  change: number;
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [categoryData, productData] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);

        if (isMounted) {
          setCategories(categoryData);
          setProducts(productData);
        }
      } catch (error: unknown) {
        console.error('Failed to load navbar data:', error);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const today = new Intl.DateTimeFormat('bn-BD', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const ticker = [...products, ...products];
  const user = session?.user;

  const formatBengaliNumber = (value: number) =>
    new Intl.NumberFormat('bn-BD').format(value);

  const handleLogout = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error('লগআউট করা যায়নি!');
        return;
      }

      setMenuOpen(false);
      toast.success('সাইন আউট সফল হয়েছে');

      router.push('/');
      router.refresh();
    } catch (error: unknown) {
      console.error('Logout failed:', error);
      toast.error('লগআউট করার সময় সমস্যা হয়েছে!');
    }
  };

  return (
    <header className="site-header">
      <div className="topbar container">
        <Link
          href="/"
          className="brand"
          onClick={() => setMenuOpen(false)}
        >
          <span className="brand-icon">
            <ShoppingBasket size={24} />
          </span>

          <span>
            <b>বাজার দর</b>
            <small>{today}</small>
          </span>
        </Link>

        <div className="auth-actions">
          {!isPending && !user && (
            <>
              <Link
                className="signin-link"
                href="/signin"
                onClick={() => setMenuOpen(false)}
              >
                সাইন ইন
              </Link>

              <Link
                className="btn btn-primary btn-small"
                href="/signup"
                onClick={() => setMenuOpen(false)}
              >
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
            onClick={() => setMenuOpen(false)}
          >
            ⌂ <span>হোম</span>
          </Link>

          {categories.map((category) => (
            <Link
              key={category.slug}
              className={
                pathname === `/category/${category.slug}`
                  ? 'nav-link active'
                  : 'nav-link'
              }
              href={`/category/${category.slug}`}
              onClick={() => setMenuOpen(false)}
            >
              {category.emoji} <span>{category.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="ticker">
        <div className="ticker-track">
          {ticker.map((product, index) => (
            <span
              className="ticker-item"
              key={`${product.slug}-${index}`}
            >
              {product.emoji} {product.name}{' '}
              <b>
                {formatBengaliNumber(product.price)} টাকা/
                {product.unit.replace('প্রতি ', '')}
              </b>{' '}
              <i
                className={
                  product.change > 0
                    ? 'up'
                    : product.change < 0
                      ? 'down'
                      : 'flat'
                }
              >
                {product.change > 0
                  ? '▲'
                  : product.change < 0
                    ? '▼'
                    : '—'}{' '}
                {formatBengaliNumber(Math.abs(product.change))}%
              </i>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}

