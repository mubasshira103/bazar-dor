export default function Loading() {
  return (
    <div className="container page-container">
      <div className="skeleton hero-skeleton" />
      <div className="product-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="skeleton card-skeleton" key={i} />
        ))}
      </div>
    </div>
  );
}
