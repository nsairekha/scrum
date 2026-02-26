import Link from "next/link";

const SECTIONS = [
  { title: "Profile", href: "/dashboard/student/profile", description: "View your details." },
  { title: "Room", href: "/dashboard/student/room", description: "See room allocation." },
  { title: "Complaints", href: "/dashboard/student/complaints", description: "Submit and track complaints." },
  { title: "Leave Requests", href: "/dashboard/student/leave-requests", description: "Apply for leave." },
  { title: "Payments", href: "/dashboard/student/payments", description: "Pay fees and view history." },
  { title: "Announcements", href: "/dashboard/student/announcements", description: "Latest hostel updates." },
];

export default function StudentDashboardPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
        <p className="mt-2 text-sm text-muted">
          Manage your institutional footprint, from room occupancy to fee settlements.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md active:scale-[0.98]"
          >
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {section.title}
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                {section.description}
              </p>
            </div>
            <div className="mt-6 flex items-center text-[10px] font-bold uppercase tracking-widest text-primary/0 group-hover:text-primary transition-all">
              Access Module <span className="ml-2">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
