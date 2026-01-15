
import { fetchHomeKpis } from "@/lib/kpi";
import KpiCard from "./kpi-card";

export default async function KpiSection() {
  const kpi = await fetchHomeKpis();

  return (
    <section className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <KpiCard label="Total Bajrangi" value={kpi.totalUsers} />
      <KpiCard label="Posts This Month" value={kpi.postsThisMonth} />
      <KpiCard label="Total Posts" value={kpi.totalPosts} />
    </section>
  );
}
