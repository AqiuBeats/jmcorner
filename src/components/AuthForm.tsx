'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        await signIn('credentials', { redirect: false, phone, password });
      } else {
        // 注册逻辑
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, password }),
        });
        if (!res.ok) throw new Error(await res.text());
        await signIn('credentials', { redirect: false, phone, password });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label>Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="w-full bg-blue-500 text-white p-2">
        {mode === 'login' ? 'Login' : 'Register'}
      </button>
    </form>
  );
}
