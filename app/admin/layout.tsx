import AdminGuard from "@/components/admin/AdminGuard";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        {/* <AdminSidebar /> */}
        <main className="flex-1  bg-gray-50">{children}</main>
      </div>
    </AdminGuard>
  );
}
