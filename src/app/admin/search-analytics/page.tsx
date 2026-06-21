import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const revalidate = 0; // Disable cache so it loads real-time data

function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return isoString;
  }
}

export default async function SearchAnalyticsPage() {
  const supabase = getSupabaseAdmin();

  // 1. Fetch Total Searches Count
  const { count: totalCount, error: totalCountError } = await supabase
    .from("search_events")
    .select("*", { count: "exact", head: true });
  const totalSearches = totalCount ?? 0;

  // 2. Fetch Searches Today Count (Start of today in local/server time)
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const { count: todayCount, error: todayCountError } = await supabase
    .from("search_events")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfToday.toISOString());
  const searchesToday = todayCount ?? 0;

  // 3. Fetch search event rows for tables (Limit 10,000 for performance and PostgREST limits)
  const { data: allEvents, error: eventsError } = await supabase
    .from("search_events")
    .select("query, results_count, created_at, retrieval_mode, user_id")
    .order("created_at", { ascending: false })
    .limit(10000);

  const rows = allEvents ?? [];

  // 4. Calculate Top 20 Queries
  const queryCounts: Record<string, number> = {};
  for (const row of rows) {
    const q = row.query.trim();
    if (q) {
      queryCounts[q] = (queryCounts[q] || 0) + 1;
    }
  }
  const topQueries = Object.entries(queryCounts)
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count || a.query.localeCompare(b.query))
    .slice(0, 20);

  // 5. Calculate Top 20 Zero-Result Queries
  const zeroQueryCounts: Record<string, number> = {};
  for (const row of rows) {
    if (row.results_count === 0) {
      const q = row.query.trim();
      if (q) {
        zeroQueryCounts[q] = (zeroQueryCounts[q] || 0) + 1;
      }
    }
  }
  const topZeroQueries = Object.entries(zeroQueryCounts)
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count || a.query.localeCompare(b.query))
    .slice(0, 20);

  // 6. Recent 50 Searches
  const recentSearches = rows.slice(0, 50);

  // Log db errors if any
  if (eventsError || totalCountError || todayCountError) {
    console.error("Database error in SearchAnalyticsPage:", {
      eventsError,
      totalCountError,
      todayCountError,
    });
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-800 pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Search Analytics
            </h1>
            <p className="text-zinc-400 mt-1 text-sm">
              Real-time insights and monitoring for user search queries
            </p>
          </div>
          <div>
            <a
              href="/admin/search-analytics"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 focus:outline-none"
            >
              🔄 Refresh Data
            </a>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col justify-between">
            <span className="text-sm font-medium text-zinc-400">Total Searches</span>
            <span className="text-5xl font-extrabold text-white mt-4 tracking-tight">
              {totalSearches.toLocaleString()}
            </span>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col justify-between">
            <span className="text-sm font-medium text-zinc-400">Searches Today</span>
            <span className="text-5xl font-extrabold text-teal-400 mt-4 tracking-tight">
              {searchesToday.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Aggregated Queries Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Top 20 Queries */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">Top 20 Queries</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-medium">
                    <th className="py-3 px-4 w-16 text-center">Rank</th>
                    <th className="py-3 px-4">Query</th>
                    <th className="py-3 px-4 text-right w-24">Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {topQueries.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-zinc-500">
                        No queries recorded.
                      </td>
                    </tr>
                  ) : (
                    topQueries.map((item, idx) => (
                      <tr key={item.query} className="hover:bg-zinc-800/20 transition">
                        <td className="py-3 px-4 text-center text-zinc-500 font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 font-medium text-zinc-200">
                          {item.query}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-zinc-400">
                          {item.count}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top 20 Zero-Result Queries */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">Top 20 Zero-Result Queries</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-medium">
                    <th className="py-3 px-4 w-16 text-center">Rank</th>
                    <th className="py-3 px-4">Query</th>
                    <th className="py-3 px-4 text-right w-24">Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {topZeroQueries.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-zinc-500">
                        No zero-result queries recorded.
                      </td>
                    </tr>
                  ) : (
                    topZeroQueries.map((item, idx) => (
                      <tr key={item.query} className="hover:bg-zinc-800/20 transition">
                        <td className="py-3 px-4 text-center text-zinc-500 font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 font-medium text-rose-300">
                          {item.query}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-zinc-400">
                          {item.count}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Recent 50 Searches */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-4">
          <h2 className="text-xl font-bold text-white">Recent 50 Searches</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-medium">
                  <th className="py-3 px-4 w-40">Time</th>
                  <th className="py-3 px-4">Query</th>
                  <th className="py-3 px-4 w-28 text-center">Mode</th>
                  <th className="py-3 px-4 w-32 text-right">Results Count</th>
                  <th className="py-3 px-4 w-48 text-right font-mono text-xs">User ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {recentSearches.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-zinc-500">
                      No searches recorded.
                    </td>
                  </tr>
                ) : (
                  recentSearches.map((item, idx) => (
                    <tr key={idx} className="hover:bg-zinc-800/20 transition">
                      <td className="py-3 px-4 text-zinc-400 font-mono text-xs">
                        {formatTime(item.created_at)}
                      </td>
                      <td className="py-3 px-4 font-medium text-zinc-200">
                        {item.query}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
                          {item.retrieval_mode}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        <span className={item.results_count === 0 ? "text-rose-400 font-semibold" : "text-zinc-300"}>
                          {item.results_count}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-zinc-500 font-mono text-xs truncate max-w-[12rem]">
                        {item.user_id}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
