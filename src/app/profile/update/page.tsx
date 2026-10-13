
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, Save, LoaderCircle, UserRound } from "lucide-react";
import toast from "react-hot-toast";

type ProfileFormProps = {
  user: {
    id: string;
    name: string;
    image?: string | null;
    email: string;
  };
};

// ছবির URL সঠিক কি না যাচাই করবে
function isValidImageUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-green-600" />
      </main>
    );
  }

  return <ProfileForm key={session.user.id} user={session.user} />;
}

function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();

  const [name, setName] = useState(user.name ?? "");
  const [image, setImage] = useState(user.image ?? "");
  const [saving, setSaving] = useState(false);

  const trimmedImage = image.trim();
  const showImage = isValidImageUrl(trimmedImage);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const finalImage = image.trim();

    if (!trimmedName) {
      toast.error("অনুগ্রহ করে আপনার নাম লিখুন।");
      return;
    }

    if (trimmedName.length > 100) {
      toast.error("নাম সর্বোচ্চ ১০০ অক্ষরের হতে পারবে।");
      return;
    }

    if (finalImage && !isValidImageUrl(finalImage)) {
      toast.error("অনুগ্রহ করে একটি সঠিক ছবির URL দিন।");
      return;
    }

    setSaving(true);

    try {
      const result = await authClient.updateUser({
        name: trimmedName,
        image: finalImage || null,
      });

      if (result.error) {
        toast.error(result.error.message || "প্রোফাইল আপডেট করা যায়নি।");
        return;
      }

      toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে!");

      router.push("/profile");
      router.refresh();
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("কোনো সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/profile"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-green-700"
        >
          <ArrowLeft size={18} />
          প্রোফাইলে ফিরে যান
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            প্রোফাইল আপডেট করুন
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            আপনার অ্যাকাউন্টের তথ্য আপডেট করুন।
          </p>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile image preview */}
            <div className="flex flex-col items-center gap-3 border-b border-gray-100 pb-6">
              {showImage ? (
                <img
                  key={trimmedImage}
                  src={trimmedImage}
                  alt="প্রোফাইল ছবির প্রিভিউ"
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full border-4 border-gray-100 object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <UserRound size={40} />
                </div>
              )}

              <p className="text-sm text-gray-500">
                প্রোফাইল ছবির প্রিভিউ
              </p>
            </div>

            {/* Name input */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                পুরো নাম <span className="text-red-500">*</span>
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="আপনার পুরো নাম লিখুন"
                autoComplete="name"
                maxLength={100}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Image URL input */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                প্রোফাইল ছবির URL
              </label>

              <input
                id="image"
                name="image"
                type="text"
                value={image}
                onChange={(event) => setImage(event.target.value)}
                placeholder="https://example.com/profile.jpg"
                autoComplete="url"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

              <p className="mt-2 text-xs text-gray-500">
                সবার দেখার উপযোগী একটি ছবির URL দিন। প্রোফাইল ছবি
                সরিয়ে ফেলতে চাইলে ঘরটি খালি রাখুন।
              </p>

              {trimmedImage && !showImage && (
                <p className="mt-2 text-sm text-red-500">
                  অনুগ্রহ করে একটি সঠিক HTTP বা HTTPS URL দিন।
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
              <Link
                href="/profile"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                বাতিল করুন
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    সংরক্ষণ হচ্ছে...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    পরিবর্তন সংরক্ষণ করুন
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
