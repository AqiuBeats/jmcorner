'use client';
// src/app/auth/login/page.tsx
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      {/* <AuthForm mode="login" /> */}
      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <a href="/auth/register" className="text-blue-500 hover:underline">
          Register
        </a>
      </p>
    </div>
  );
}