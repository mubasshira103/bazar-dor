// import SignInForm from "@/components/SignInForm";
// export default function SignInPage() { return <SignInForm />; }

'use client';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

// UI-only starter: real authentication is intentionally left for your practice.
export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return toast.error('ইমেইল ও পাসওয়ার্ড লিখুন');
    toast('এটি UI demo। Authentication নিজে যুক্ত করে শিখুন।');
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
          <button className="btn btn-primary auth-submit">সাইন ইন</button>
        </form>
        <div className="or-divider">
          <span>অথবা</span>
        </div>
        <div className="social-row">
          <button type="button" onClick={() => toast('Google Authentication পরে যুক্ত করুন')}>
            Google দিয়ে চালিয়ে যান
          </button>
          <button type="button" onClick={() => toast('GitHub Authentication পরে যুক্ত করুন')}>
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
