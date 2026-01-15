"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Kpis = {
  totalUsers: number;
  postsThisMonth: number;
  activeKhands: number;
};

export default function KpiSection() {
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const snap = await getDocs(collection(db, "kpis"));
        if (!snap.empty) {
          setKpis(snap.docs[0].data() as Kpis);
        }
      } catch (e) {
        console.error("Failed to load KPIs", e);
      } finally {
        setLoading(false);
      }
    };

    fetchKpis();
  }, []);

  if (loading) return <div>Loading KPIs…</div>;
  if (!kpis) return <div>No KPI data available</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <KpiCard title="Total Bajrangi" value={kpis.totalUsers} />
      <KpiCard title="Posts This Month" value={kpis.postsThisMonth} />
      <KpiCard title="Active Khands" value={kpis.activeKhands} />
    </div>
  );
}

function KpiCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-orange-600">{value}</p>
    </div>
  );
}
