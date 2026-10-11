import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="container page-container">
      <div className="empty-state not-found">
        <div>🔎</div>
        <h1>পৃষ্ঠা খুঁজে পাওয়া যায়নি</h1>
        <p>আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি নেই অথবা সরিয়ে ফেলা হয়েছে।</p>
        <Link className="btn btn-primary" href="/">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}
