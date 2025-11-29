'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/hooks/useAuth';
import Link from 'next/link';

export default function RegisterPage() {
  const { registerAgency } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ agencyName: '', fullName: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerAgency(form);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container-page max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Create your agency</h1>
      <form className="card space-y-3" onSubmit={handleSubmit}>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <label className="block text-sm mb-1">Agency name</label>
          <input className="w-full border p-2 rounded" value={form.agencyName} onChange={(e) => setForm({ ...form, agencyName: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Your full name</label>
          <input className="w-full border p-2 rounded" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="w-full border p-2 rounded" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" className="w-full border p-2 rounded" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn-primary w-full" type="submit">
          Create account
        </button>
        <p className="text-sm text-center">
          Already have an account? <Link className="text-blue-600" href="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
