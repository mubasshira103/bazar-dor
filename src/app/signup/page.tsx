
'use client';

import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const image = String(formData.get('image') ?? '').trim();

    if (!name || !email || !password || !image) {
      toast.error('সব তথ্য পূরণ করুন');
      return;
    }

    if (password.length < 8) {
      toast.error('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        image,
        callbackURL: '/',
      });

      if (error) {
        toast.error(error.message || 'সাইন আপ করা যায়নি');
        return;
      }

      if (data) {
        toast.success('সাইন আপ সফল হয়েছে');
        router.push('/');
      }
    } catch {
      toast.error('সমস্যা হয়েছে, আবার চেষ্টা করুন');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      const { error } = await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
      });

      if (error) toast.error(error.message);
    } catch {
      toast.error('Google Authentication ব্যর্থ হয়েছে');
    }
  }

  async function handleGithubSignIn() {
    try {
      const { error } = await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/',
      });

      if (error) toast.error(error.message);
    } catch {
      toast.error('GitHub Authentication ব্যর্থ হয়েছে');
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-heading">
        <h1>অ্যাকাউন্ট তৈরি করুন</h1>
        <p>বিনা খরচে সাইন আপ করে বিস্তারিত দাম দেখুন।</p>
      </div>

      <section className="auth-card">
        <form onSubmit={handleSubmit}>
          <label>
            নাম
            <input
              name="name"
              autoComplete="name"
              placeholder="যেমন: রহিম উদ্দিন"
              required
            />
          </label>

          <label>
            ইমেইল
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            পাসওয়ার্ড
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              placeholder="কমপক্ষে ৮ অক্ষর"
              required
            />
          </label>

          <label>
            Image URL
            <input
              name="image"
              type="url"
              placeholder="https://example.com/image.jpg"
              required
            />
          </label>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন'}
          </button>
        </form>

        <div className="or-divider">
          <span>অথবা</span>
        </div>

        <div className="social-row">
          <button type="button" onClick={handleGoogleSignIn}>
            Google দিয়ে চালিয়ে যান
          </button>

          <button type="button" onClick={handleGithubSignIn}>
            GitHub দিয়ে চালিয়ে যান
          </button>
        </div>

        <p className="auth-switch">
          অ্যাকাউন্ট আছে? <Link href="/signin">সাইন ইন করুন</Link>
        </p>
      </section>

      <Link href="/" className="back-home">
        ← হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}
