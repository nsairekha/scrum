import { redirect } from "next/navigation";
import { getTokenFromCookies, verifyAuthToken } from "@/lib/auth";

export default async function DashboardPage() {
  const token = await getTokenFromCookies();
  const payload = token ? verifyAuthToken(token) : null;

  if (!payload) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-black">Dashboard</h1>
        <p className="text-sm text-black">
          Welcome back, {payload.email}. Your role is {payload.role}.
        </p>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs uppercase text-black">Residents</p>
          <p className="text-2xl font-semibold text-black">0</p>
          <p className="text-sm text-black">Connect to database</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs uppercase text-black">Rooms</p>
          <p className="text-2xl font-semibold text-black">0</p>
          <p className="text-sm text-black">Set up rooms inventory</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs uppercase text-black">Requests</p>
          <p className="text-2xl font-semibold text-black">0</p>
          <p className="text-sm text-black">Track pending actions</p>
        </div>
      </section>
    </div>
  );
}
