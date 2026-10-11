import { notFound } from 'next/navigation';
import { getCategories, getProducts } from '@/lib/api';
import SortProducts from '@/components/SortProducts';
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [cats, all] = await Promise.all([getCategories(), getProducts()]);
  const category = cats.find((c) => c.slug === slug);
  if (!category) notFound();
  const items = all.filter((p) => p.category === slug || p.categoryName === category.name);
  return (
    <div className="container page-container">
      <div className="category-title">
        <span className="large-emoji">{category.emoji}</span>
        <div>
          <h1>{category.name}</h1>
          <p>{category.name} পণ্যের আজকের দাম ও পরিবর্তন</p>
        </div>
      </div>
      <SortProducts items={items} />
    </div>
  );
}
