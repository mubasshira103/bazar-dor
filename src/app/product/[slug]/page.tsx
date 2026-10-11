import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/api';
import { formatBengaliNumber } from '@/lib/products';
import { MapPin, ArrowLeft, GraduationCap } from 'lucide-react';
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();
  return (
    <div className="container page-container">
      <Link className="back-link" href="/">
        <ArrowLeft size={16} /> হোম পেজে ফিরুন
      </Link>
      <section className="detail-summary">
        <span className="detail-emoji">{p.emoji}</span>
        <div className="detail-main">
          <div className="tag-row">
            <span className="tag">{p.categoryName}</span>
            <span className="tag">{p.unit}</span>
          </div>
          <h1>{p.name}</h1>
          <p>{p.description}</p>
        </div>
        <div className="current-price">
          <small>আজকের সম্ভাব্য দাম</small>
          <strong>{formatBengaliNumber(p.price)}</strong>
          <span>টাকা / {p.unit.replace('প্রতি ', '')}</span>
          <i className={p.change > 0 ? 'down' : p.change < 0 ? 'up' : 'flat'}>
            {p.change > 0 ? '▲' : p.change < 0 ? '▼' : '—'}{' '}
            {formatBengaliNumber(Math.abs(p.change))}%
          </i>
        </div>
      </section>
      <section className="content-section">
        <h2>দামের সারসংক্ষেপ</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <small>সর্বনিম্ন দাম</small>
            <strong className="stat-green">{formatBengaliNumber(p.minPrice)} টাকা</strong>
            <span>বাজারে সর্বনিম্ন পাওয়া দাম</span>
          </div>
          <div className="stat-card">
            <small>সর্বোচ্চ দাম</small>
            <strong className="stat-red">{formatBengaliNumber(p.maxPrice)} টাকা</strong>
            <span>বাজারে সর্বোচ্চ পাওয়া দাম</span>
          </div>
          <div className="stat-card">
            <small>গড় দাম</small>
            <strong>{formatBengaliNumber(p.averagePrice)} টাকা</strong>
            <span>সব বাজারের আনুমানিক গড়</span>
          </div>
        </div>
      </section>
      <section className="content-section">
        <h2>বাজারভিত্তিক আজকের দাম</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>বাজার</th>
                <th>জেলা</th>
                <th>সর্বনিম্ন</th>
                <th>সর্বোচ্চ</th>
                <th>দর</th>
              </tr>
            </thead>
            <tbody>
              {p.markets.map((m) => (
                <tr key={m.name}>
                  <td>
                    <MapPin size={14} className="inline-icon" />
                    {m.name}
                  </td>
                  <td>{m.district}</td>
                  <td>{formatBengaliNumber(m.min)} টাকা</td>
                  <td>{formatBengaliNumber(m.max)} টাকা</td>
                  <td>
                    <b>{formatBengaliNumber(m.price)} টাকা</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="data-note">
          দ্রষ্টব্য: API থেকে বাজারভিত্তিক তথ্য না পাওয়া গেলে নমুনা মূল্য দেখানো হতে পারে।
        </p>
      </section>
    </div>
  );
}
