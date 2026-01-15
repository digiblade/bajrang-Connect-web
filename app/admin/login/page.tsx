"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/admin-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminLogin(email, password);
      router.replace("/admin/dashboard"); // 🔑 replace, not push
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-orange-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow"
      >
        <h1 className="mb-6 text-center text-2xl font-bold text-orange-600">
          Admin Login
        </h1>

        {error && (
          <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Admin Email"
          className="mb-4 w-full rounded border px-4 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-6 w-full rounded border px-4 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full rounded bg-orange-500 py-2 font-semibold text-white hover:bg-orange-600"
        >
          {loading ? "Checking access..." : "Login"}
        </button>
      </form>
    </main>
  );
}
