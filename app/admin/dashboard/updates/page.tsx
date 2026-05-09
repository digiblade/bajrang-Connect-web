import UpdatesManager from "@/components/admin/updates-manager";
import Link from "next/link";

export default function UpdatesPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-16">
      <div className="mb-6">
        <Link
          href="/admin/dashboard"
          className="text-sm text-orange-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-orange-600">
        Updates Management
      </h1>

      <p className="text-gray-700">
        Create, schedule, and publish updates to broadcast important announcements
        to all connected users via push notifications.
      </p>

      <UpdatesManager />
    </main>
  );
}
