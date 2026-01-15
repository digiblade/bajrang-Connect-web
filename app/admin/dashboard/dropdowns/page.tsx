import DropdownManager from "@/components/admin/dropdown-manager";
import KhandManager from "@/components/admin/khand-manager";

export default function DropdownAdminPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <h1 className="text-2xl font-bold text-orange-600">
        Dropdown Management
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <DropdownManager title="Prakhand" collectionName="prakhand" />
        <DropdownManager title="Dayitwa" collectionName="dayitwa" />
        <DropdownManager title="Karya" collectionName="karya" />
        <KhandManager />
      </div>
    </main>
  );
}
