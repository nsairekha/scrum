"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";

type AnalyticsResponse = {
  studentCountByBlock: { block: string; students: number }[];
  monthlyPayments: { month: string; total: number }[];
  complaintSummary: { status: string; count: number }[];
  leaveTrends: { month: string; count: number }[];
};

const COLORS = ["#0f172a", "#334155", "#64748b", "#94a3b8"];

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/admin/analytics");
      if (!response.ok) {
        setError("Unable to load analytics");
        return;
      }
      const payload = (await response.json()) as AnalyticsResponse;
      setData(payload);
    };

    load();
  }, []);

  if (error) {
    return (
      <div className="panel p-6 border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/20">
        <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-sm text-muted animate-pulse font-medium uppercase tracking-widest">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">
          System <span className="text-primary italic font-serif font-light">Analytics</span>
        </h1>
        <p className="text-sm text-muted mt-2">
          Overview of hostel operations and institutional trends.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-6">
          <h2 className="text-xs font-bold text-primary uppercase tracking-widest mb-6">
            Student distribution by block
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.studentCountByBlock}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="block" 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted))" }} 
                />
                <YAxis 
                  allowDecimals={false} 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted))" }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--surface))", 
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))"
                  }} 
                />
                <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-6">
          <h2 className="text-xs font-bold text-primary uppercase tracking-widest mb-6">
            Revenue trends
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyPayments}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted))" }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted))" }}
                />
                <Tooltip 
                   contentStyle={{ 
                    backgroundColor: "hsl(var(--surface))", 
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))"
                  }} 
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--surface))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-6">
          <h2 className="text-xs font-bold text-primary uppercase tracking-widest mb-6">
            Complaint resolution status
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.complaintSummary}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                >
                  {data.complaintSummary.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? "hsl(var(--primary))" : `hsl(var(--primary) / ${0.8 - index * 0.2})`} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ 
                    backgroundColor: "hsl(var(--surface))", 
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))"
                  }} 
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle"
                  formatter={(value) => <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-6">
          <h2 className="text-xs font-bold text-primary uppercase tracking-widest mb-6">
            Leave patterns
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.leaveTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted))" }}
                />
                <YAxis 
                  allowDecimals={false} 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted))" }}
                />
                <Tooltip 
                   contentStyle={{ 
                    backgroundColor: "hsl(var(--surface))", 
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))"
                  }} 
                />
                <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
