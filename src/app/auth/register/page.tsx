// src/app/auth/register/page.tsx
import AuthForm from "@/components/AuthForm";

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      <AuthForm mode="register" />
      <p className="mt-4 text-center">
        Already have an account?{" "}
        <a href="/auth/login" className="text-blue-500 hover:underline">
          Login
        </a>
      </p>
    </div>
  );
}