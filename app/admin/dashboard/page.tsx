import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-16">
      <h1 className="text-3xl font-bold text-orange-600">
        Admin Dashboard
      </h1>

      <p className="mt-4 text-gray-700">
        Welcome, Admin. Manage members, posts, and configurations here.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          href="/admin/dashboard/posts"
          className="rounded-xl border bg-white p-5 shadow transition hover:border-orange-300"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            Posts Approval
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Block/unblock posts or delete them permanently.
          </p>
        </Link>

        <Link
          href="/admin/dashboard/users"
          className="rounded-xl border bg-white p-5 shadow transition hover:border-orange-300"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            User Management
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            View all users and toggle `isValid` / `isActive`.
          </p>
        </Link>

        <Link
          href="/admin/dashboard/dropdowns"
          className="rounded-xl border bg-white p-5 shadow transition hover:border-orange-300"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            Dropdown Management
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage prakhand, dayitwa, karya, and khand values.
          </p>
        </Link>

        <Link
          href="/admin/dashboard/updates"
          className="rounded-xl border bg-white p-5 shadow transition hover:border-orange-300"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            Updates Management
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Create, schedule, and publish updates with push notifications.
          </p>
        </Link>
      </div>
    </main>
  );
}
