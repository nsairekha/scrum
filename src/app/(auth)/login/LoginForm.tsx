"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const { safeJson } = await import("@/lib/safe-json");
      const payload = await safeJson(response);
      setError(payload?.error ?? "Login failed");
      setIsSubmitting(false);
      return;
    }

    // Get user data to determine redirect
    const { safeJson } = await import("@/lib/safe-json");
    const data = await safeJson(response);
    const role = data?.user?.role || "STUDENT";

    // Use window.location for hard redirect to ensure cookies are loaded
    if (role === "ADMIN") {
      window.location.href = "/dashboard/admin/analytics";
    } else if (role === "WARDEN") {
      window.location.href = "/dashboard/warden";
    } else {
      window.location.href = "/dashboard/student";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-black outline-none focus:border-zinc-400"
          placeholder="student@hostel.local"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-black outline-none focus:border-zinc-400"
          placeholder="Minimum 8 characters"
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-11 w-full items-center justify-center rounded-md bg-zinc-900 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-zinc-500"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-black hover:underline">
          Sign up
        </Link>
      </div>
    </form>
  );
}
