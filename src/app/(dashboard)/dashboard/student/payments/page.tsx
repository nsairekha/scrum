"use client";

import { useEffect, useState } from "react";

type Payment = {
  id: string;
  amount: string;
  status: string;
  paymentDate: string;
};

export default function StudentPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPayments = async () => {
    const response = await fetch("/api/student/payments");
    if (!response.ok) {
      setError("Unable to load payments");
      return;
    }
    const payload = (await response.json()) as { payments: Payment[] };
    setPayments(payload.payments);
  };

  useEffect(() => {
    (async () => {
      await loadPayments();
    })();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const numericAmount = Number(amount);
    const response = await fetch("/api/student/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: numericAmount }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error ?? "Unable to submit payment");
      setIsSubmitting(false);
      return;
    }

    setAmount("");
    await loadPayments();
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Payments</h1>
        <p className="mt-1 text-sm text-muted">
          Institutional fee settlement and transaction records.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-border bg-surface p-6 shadow-sm"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/70" htmlFor="amount">
            Transaction Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted">₹</span>
            <input
              id="amount"
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
              className="input-bespoke pl-8"
              placeholder="e.g. 5000"
            />
          </div>
        </div>
        {error ? <p className="text-sm text-red-600 font-medium">{error}</p> : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-bespoke px-8 py-3 text-sm font-semibold shadow-sm active:translate-y-0.5"
        >
          {isSubmitting ? "Processing..." : "Initialize Payment"}
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Transaction History</h2>
        {payments.length === 0 ? (
          <p className="text-sm text-muted">No historical transactions found.</p>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="rounded-xl border border-border bg-surface p-6 shadow-sm group hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="text-base font-bold text-foreground">
                    ₹{Number(payment.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary px-2 py-1 bg-primary/5 rounded">
                    {payment.status.replaceAll("_", " ")}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted/60">
                  <span>Audit ID: {payment.id.slice(0, 8)}</span>
                  <span>{new Date(payment.paymentDate).toLocaleDateString()} · {new Date(payment.paymentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
