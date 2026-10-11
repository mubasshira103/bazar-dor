
'use client';

import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error('ইমেইল ও পাসওয়ার্ড লিখুন');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: '/',
      });

      if (error) {
        toast.error(error.message || 'সাইন ইন করা যায়নি');
        return;
      }

      if (data) {
        toast.success('সাইন ইন সফল হয়েছে');
        router.push('/');
        router.refresh();
      }
    } catch {
      toast.error('সমস্যা হয়েছে। আবার চেষ্টা করুন।');
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

      if (error) {
        toast.error(error.message || 'Google দিয়ে সাইন ইন করা যায়নি');
      }
    } catch {
      toast.error('Google Authentication-এ সমস্যা হয়েছে');
    }
  }

  async function handleGithubSignIn() {
    try {
      const { error } = await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/',
      });

      if (error) {
        toast.error(error.message || 'GitHub দিয়ে সাইন ইন করা যায়নি');
      }
    } catch {
      toast.error('GitHub Authentication-এ সমস্যা হয়েছে');
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-heading">
        <h1>সাইন ইন</h1>
        <p>বিস্তারিত দাম ও বাজার তুলনা দেখতে অ্যাকাউন্টে প্রবেশ করুন।</p>
      </div>

      <section className="auth-card">
        <form onSubmit={handleSubmit}>
          <label>
            ইমেইল
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            পাসওয়ার্ড
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="আপনার পাসওয়ার্ড"
              required
            />
          </label>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? 'সাইন ইন হচ্ছে...' : 'সাইন ইন'}
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
          অ্যাকাউন্ট নেই? <Link href="/signup">সাইন আপ করুন</Link>
        </p>
      </section>

      <Link href="/" className="back-home">
        ← হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}
