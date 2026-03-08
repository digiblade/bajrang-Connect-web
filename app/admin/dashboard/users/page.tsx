import UsersManager from "@/components/admin/users-manager";

export default function UsersAdminPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <h1 className="text-2xl font-bold text-orange-600">
        Users Management
      </h1>
      <UsersManager />
    </main>
  );
}
