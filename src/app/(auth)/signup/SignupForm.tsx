"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const { safeJson } = await import("@/lib/safe-json");
      const payload = await safeJson(response);
      setError(payload?.error ?? "Signup failed");
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/70 block" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="input-bespoke"
            placeholder="your@email.com"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/70 block" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input-bespoke"
            placeholder="Minimum 8 characters"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/70 block" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="input-bespoke"
            placeholder="Confirm your password"
          />
        </div>
      </div>

      {error ? (
        <div className="p-3 border border-red-200 bg-red-50 text-red-700 text-xs font-medium rounded-lg">
          {error}
        </div>
      ) : null}

      <div className="space-y-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-bespoke w-full py-3 text-sm font-semibold shadow-sm active:translate-y-0.5"
        >
          {isSubmitting ? "Creating account..." : "Sign up"}
        </button>
        
        <div className="text-center">
          <span className="text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:text-accent transition-colors">
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </form>
  );
}
