export async function fetchHomeKpis() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_KPI_URL}/getHomeKpis`,
    {
      next: { revalidate: 600 },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch KPIs");
  }

  return res.json();
}
