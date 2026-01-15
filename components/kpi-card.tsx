interface Props {
  label: string;
  value: number;
}

export default function KpiCard({ label, value }: Props) {
  return (
    <div className="rounded-xl bg-white p-6 text-center shadow-md border border-orange-100">
      <div className="text-3xl font-bold text-orange-600">
        {value}
      </div>
      <div className="mt-1 text-sm font-medium text-gray-700">
        {label}
      </div>
    </div>
  );
}
