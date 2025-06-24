import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface AnalyticsChartProps {
  links: { _id: string; category: string }[];
}

export default function AnalyticsChart({ links }: AnalyticsChartProps) {
  // Count links per category
  const categoryCount: Record<string, number> = {};
  links.forEach((link) => {
    categoryCount[link.category] = (categoryCount[link.category] || 0) + 1;
  });

  const data = Object.entries(categoryCount).map(([category, count]) => ({
    category,
    count,
  }));

  return (
    <div className="bg-[#2e2e42] p-4 rounded-xl shadow-lg text-white">
      <h3 className="text-xl font-semibold mb-4">Links per Category</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="category" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
