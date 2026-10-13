import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  const today = new Intl.DateTimeFormat('bn-BD', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 overflow-hidden rounded-3xl bg-white px-6 py-12 sm:px-10 md:grid-cols-2 md:px-14 md:py-16">
      {/* Left Side - Content */}
      <div className="space-y-6">
        <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
          {today}
        </span>

        <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
          আজকের বাজারের দাম এক নজরে
        </h1>

        <p className="max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
          চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়,
          সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
        </p>

        <Link
          href="#সব-পণ্য"
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          সব পণ্য দেখুন
          <ArrowDown size={18} />
        </Link>
      </div>

      {/* Right Side - Image */}
      <div className="relative flex items-center justify-center">
        <div className="absolute h-64 w-64 rounded-full bg-orange-200/60 blur-3xl sm:h-80 sm:w-80" />

        <Image
          src="/bazar-hero.png"
          alt="বাজারের তাজা ফল ও সবজি"
          width={600}
          height={500}
          priority
          className="relative z-10 h-auto w-full max-w-md object-contain drop-shadow-xl"
        />
      </div>
    </section>
  );
}
