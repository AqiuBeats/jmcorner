"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>You are not authenticated. <a href="/auth/login" className="text-blue-500 hover:underline">Login</a></p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <p>Welcome</p>
      <button
        onClick={() => signOut()}
        className="mt-4 bg-red-500 text-white p-2 rounded"
      >
        Sign out
      </button>
    </div>
  );
}