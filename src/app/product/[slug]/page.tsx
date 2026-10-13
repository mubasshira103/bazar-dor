import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/api';
import { MapPin, ArrowLeft } from 'lucide-react';

function formatBengaliNumber(value: number) {
  return new Intl.NumberFormat('bn-BD').format(value);
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProduct(slug);

  if (!p) {
    notFound();
  }

  const unit = p.unit.replace(/^প্রতি\s*/, '');

  const unitLabels: Record<string, string> = {
    kg: 'প্রতি কেজি',
    litre: 'প্রতি লিটার',
    piece: 'প্রতি পিস',
    pcs: 'প্রতি পিস',
    dozen: 'প্রতি ডজন',
  };

  const displayUnit = unitLabels[p.unit.toLowerCase()] || p.unit;

  return (
    <div className="container page-container">
      <Link className="back-link" href="/">
        <ArrowLeft size={16} /> হোম পেজে ফিরুন
      </Link>

      <section className="detail-summary">
        <span className="detail-emoji">{p.emoji}</span>

        <div className="detail-main">
          <h1>{p.name}</h1>
          <div className="tag-row font-bold">
            <span>{p.name}</span>
            <span>{displayUnit}</span>
          </div>
          <div className="mt-1">
            গতকালকের তুলনায় আজ দাম {p.change > 0 ? 'বেড়েছে' : p.change < 0 ? 'কমেছে' : '—'} -{' '}
            <i className={p.change > 0 ? 'up' : p.change < 0 ? 'down' : 'flat'}>
              {p.change > 0 ? '▲' : p.change < 0 ? '▼' : '—'}{' '}
              {formatBengaliNumber(Math.abs(p.change))}%
            </i>
          </div>
          {/* <p>{p.description}</p> */}
        </div>

        <div className="current-price">
          <small>আজকের দাম</small>

          <strong>{formatBengaliNumber(p.price)}</strong>

          <span>টাকা / {unit}</span>

          <i className={p.change > 0 ? 'up' : p.change < 0 ? 'down' : 'flat'}>
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
          </div>

          <div className="stat-card">
            <small>সর্বোচ্চ দাম</small>
            <strong className="stat-red">{formatBengaliNumber(p.maxPrice)} টাকা</strong>
          </div>

          <div className="stat-card">
            <small>গড় দাম</small>
            <strong>{formatBengaliNumber(p.averagePrice)} টাকা</strong>
          </div>
        </div>
      </section>

      <section className="content-section">
        <h2>বাজারভিত্তিক আজকের দাম</h2>

        {p.markets.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>বাজার</th>
                  <th>বিভাগ</th>
                  <th>সর্বনিম্ন</th>
                  <th>সর্বোচ্চ</th>
                  <th>দর</th>
                </tr>
              </thead>

              <tbody>
                {p.markets.map((market, index) => (
                  <tr key={`${market.name}-${index}`}>
                    <td>
                      <MapPin size={14} className="inline-icon" />
                      {market.name}
                    </td>

                    <td>{market.district}</td>

                    <td>{formatBengaliNumber(market.min)} টাকা</td>

                    <td>{formatBengaliNumber(market.max)} টাকা</td>

                    <td>
                      <b>{formatBengaliNumber(market.price)} টাকা</b>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।</p>
        )}
      </section>
    </div>
  );
}
