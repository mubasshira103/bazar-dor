'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { UserRound, Mail, Pencil, LoaderCircle, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/signin');
    }
  }, [isPending, session, router]);

  if (isPending || !session || !user) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-8 w-8 animate-spin text-green-600" />
          <p className="text-sm text-gray-500">আপনার প্রোফাইল লোড হচ্ছে...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          {user.image ? (
            <Image
              width={45}
              height={45}
              src={user.image}
              alt={user.name || 'ব্যবহারকারীর প্রোফাইল'}
              className="mx-auto mb-4 h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
            />
          ) : (
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-700">
              <UserRound size={42} />
            </div>
          )}

          <h1 className="text-3xl font-bold text-gray-900">আমার প্রোফাইল</h1>

          <p className="mt-2 text-sm text-gray-500">
            আপনার অ্যাকাউন্টের তথ্য দেখুন।
          </p>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-gray-800">
              ব্যক্তিগত তথ্য
            </h2>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-4 rounded-xl bg-gray-50 p-4">
              <UserRound className="mt-1 shrink-0 text-green-600" size={22} />

              <div className="min-w-0">
                <p className="text-sm text-gray-500">পুরো নাম</p>
                <p className="mt-1 break-words font-medium text-gray-900">
                  {user.name || 'নাম দেওয়া হয়নি'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl bg-gray-50 p-4">
              <Mail className="mt-1 shrink-0 text-green-600" size={22} />

              <div className="min-w-0">
                <p className="text-sm text-gray-500">ইমেইল ঠিকানা</p>
                <p className="mt-1 break-all font-medium text-gray-900">
                  {user.email || 'ইমেইল দেওয়া হয়নি'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Link
              href="/profile/update"
              className="inline-flex w-full text-center flx flex-row justify-center shrink-0 items-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-green-700"
            >
              <Pencil size={16} />
              প্রোফাইল আপডেট করুন
            </Link>
          </div>

          <div className="mt-4 border-t border-gray-100 pt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-green-700 transition hover:text-green-800"
            >
              <ArrowLeft size={16} />
              হোম পেজে ফিরে যান
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
