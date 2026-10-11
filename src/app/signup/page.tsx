// import SignUpForm from "@/components/SignUpForm";
// export default function SignUpPage() { return <SignUpForm />; }

'use client';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

// UI-only starter: real registration is intentionally left for your practice.
export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) return toast.error('সব তথ্য পূরণ করুন');
    if (password.length < 8) return toast.error('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে');
    toast('এটি UI demo। Registration logic নিজে যুক্ত করে শিখুন।');
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
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: রহিম উদ্দিন"
              required
            />
          </label>
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="কমপক্ষে ৮ অক্ষর"
              minLength={8}
              required
            />
          </label>
          <button className="btn btn-primary auth-submit">অ্যাকাউন্ট তৈরি করুন</button>
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
          অ্যাকাউন্ট আছে? <Link href="/signin">সাইন ইন করুন</Link>
        </p>
      </section>
      <Link href="/" className="back-home">
        ← হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}
