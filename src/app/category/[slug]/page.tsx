import { notFound } from 'next/navigation';
import { getCategories, getProducts } from '@/lib/api';
import SortProducts from '@/components/SortProducts';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: originalSlug } = await params;

const slug = originalSlug
  .replace('dim-dudh', 'dim-dui')
  .replace('moshla', 'mosla');

  const [categories, products] = await Promise.all([getCategories(), getProducts(slug)]);

  const category = categories.find(
    (item) => item.slug.trim().toLowerCase() === slug.trim().toLowerCase()
  );

  if (!category) notFound();

  return (
    <div className="container page-container">
      <div className="category-title">
        <span className="large-emoji">{category.emoji}</span>

        <div>
          <h1>{category.name}</h1>
          <p>{category.name} পণ্যের আজকের দাম ও পরিবর্তন</p>
        </div>
      </div>

      <SortProducts items={products} />
    </div>
  );
}
