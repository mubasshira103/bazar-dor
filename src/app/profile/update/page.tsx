"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, Save, LoaderCircle, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

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

type ProfileFormProps = {
  user: {
    id: string;
    name: string;
    image?: string | null;
    email: string;
  };
};

function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();

  const [name, setName] = useState(user.name ?? "");
  const [image, setImage] = useState(user.image ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedImage = image.trim();

    if (!trimmedName) {
      toast.error("Please enter your name.");
      return;
    }

    if (trimmedImage) {
      try {
        const parsedUrl = new URL(trimmedImage);

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          toast.error("Please enter a valid image URL.");
          return;
        }
      } catch {
        toast.error("Please enter a valid image URL.");
        return;
      }
    }

    setSaving(true);

    try {
      const result = await authClient.updateUser({
        name: trimmedName,
        image: trimmedImage || null,
      });

      if (result.error) {
        toast.error(result.error.message || "Failed to update profile.");
        return;
      }

      toast.success("Profile updated successfully!");
      router.push("/profile");
      router.refresh();
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Something went wrong. Please try again.");
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
          Back to Profile
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Update Profile
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Update your account information.
          </p>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-3 border-b border-gray-100 pb-6">
              {image.trim() ? (
                <Image
                width={65}
                height={65}
                  src={image.trim()}
                  alt="Profile preview"
                  className="h-24 w-24 rounded-full border-4 border-gray-100 object-cover"
                  onError={(event) => {
                    event.currentTarget.style.visibility = "hidden";
                  }}
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <UserRound size={40} />
                </div>
              )}

              <p className="text-sm text-gray-500">
                Profile picture preview
              </p>
            </div>

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                maxLength={100}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>


            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Profile Image URL
              </label>
              <input
                id="image"
                name="image"
                type="url"
                value={image}
                onChange={(event) => setImage(event.target.value)}
                placeholder="https://example.com/profile.jpg"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
              <p className="mt-2 text-xs text-gray-500">
                Enter a publicly accessible image URL. Leave empty to
                remove your profile picture.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
              <Link
                href="/profile"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
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
