export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">
          Admin <span className="text-primary italic font-serif font-light">Dashboard</span>
        </h1>
        <p className="text-sm text-muted mt-2">
          Oversee users, rooms, and system settings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="panel p-6 space-y-2">
          <h3 className="font-semibold text-foreground">User Management</h3>
          <p className="text-sm text-muted">Manage students, wardens, and admin accounts.</p>
        </div>
        <div className="panel p-6 space-y-2">
          <h3 className="font-semibold text-foreground">Infrastructure</h3>
          <p className="text-sm text-muted">Configure blocks, rooms, and capacity settings.</p>
        </div>
        <div className="panel p-6 space-y-2">
          <h3 className="font-semibold text-foreground">System Logs</h3>
          <p className="text-sm text-muted">View audit logs and system performance metrics.</p>
        </div>
      </div>
    </div>
  );
}
