import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import { getProducts } from '@/lib/api';
import { formatBengaliNumber } from '@/lib/products';
import Link from 'next/link';
import { ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react';

export default async function HomePage() {
  const all = await getProducts();
  const risers = [...all]
    .filter((p) => p.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 6);
  const fallers = [...all]
    .filter((p) => p.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 6);
  return (
    <div className="container page-container">
      <Hero />
      <section className="content-section">
        <div className="section-heading">
          <h2>
            <span className="red-dot">▲</span> আজ দাম বেড়েছে
          </h2>
          <span>সর্বাধিক দাম বৃদ্ধি</span>
        </div>
        <ProductGrid items={risers} />
      </section>
      <section className="content-section">
        <div className="section-heading">
          <h2>
            <span className="green-dot">▼</span> আজ দাম কমেছে
          </h2>
          <span>সর্বাধিক দাম হ্রাস</span>
        </div>
        <ProductGrid items={fallers} />
      </section>
      <section className="content-section" id="সব-পণ্য">
        <div className="section-heading all-heading">
          <div>
            <h2>সব পণ্য</h2>
            <p>প্রয়োজনীয় পণ্যের আজকের দাম ও পরিবর্তন দেখুন</p>
          </div>
          <span>{formatBengaliNumber(all.length)}টি পণ্য</span>
        </div>
        <ProductGrid items={all} />
      </section>
    </div>
  );
}
