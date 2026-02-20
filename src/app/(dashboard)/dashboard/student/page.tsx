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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-black">Student Dashboard</h1>
        <p className="text-sm text-black">
          Manage your profile, room, requests, and payments.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {SECTIONS.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className="rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300"
          >
            <h2 className="text-lg font-semibold text-black">
              {section.title}
            </h2>
            <p className="mt-1 text-sm text-black">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
