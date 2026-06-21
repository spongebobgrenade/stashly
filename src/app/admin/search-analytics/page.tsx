import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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
  // Security & Admin check: Only show data for authenticated user
  const userSupabase = await createClient();
  const {
    data: { user },
  } = await userSupabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = getSupabaseAdmin();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  // Parallel database queries for high efficiency and scalability
  const [
    { count: totalCount, error: totalCountError },
    { count: todayCount, error: todayCountError },
    { count: sevenDaysCount, error: sevenDaysError },
    { count: successCount, error: successError },
    { count: hybridCount, error: hybridError },
    { count: semanticCount, error: semanticError },
    { count: keywordCount, error: keywordError },
    { data: allEvents, error: eventsError },
  ] = await Promise.all([
    supabase.from("search_events").select("*", { count: "exact", head: true }),
    supabase
      .from("search_events")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfToday.toISOString()),
    supabase
      .from("search_events")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo.toISOString()),
    supabase
      .from("search_events")
      .select("*", { count: "exact", head: true })
      .gt("results_count", 0),
    supabase
      .from("search_events")
      .select("*", { count: "exact", head: true })
      .eq("retrieval_mode", "hybrid"),
    supabase
      .from("search_events")
      .select("*", { count: "exact", head: true })
      .eq("retrieval_mode", "semantic"),
    supabase
      .from("search_events")
      .select("*", { count: "exact", head: true })
      .eq("retrieval_mode", "keyword"),
    supabase
      .from("search_events")
      .select("query, results_count, created_at, retrieval_mode, user_id")
      .order("created_at", { ascending: false })
      .limit(10000),
  ]);

  const totalSearches = totalCount ?? 0;
  const searchesToday = todayCount ?? 0;
  const searchesLast7Days = sevenDaysCount ?? 0;
  const searchesSuccess = successCount ?? 0;
  const hybridSearches = hybridCount ?? 0;
  const semanticSearches = semanticCount ?? 0;
  const keywordSearches = keywordCount ?? 0;
  const rows = allEvents ?? [];

  // Search Success Rate
  const searchSuccessRate =
    totalSearches > 0 ? (searchesSuccess / totalSearches) * 100 : 0;

  // Calculate Top 20 Queries
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

  // Calculate Top 20 Zero-Result Queries
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

  // Recent 50 Searches
  const recentSearches = rows.slice(0, 50);

  // Log database errors if any
  if (
    eventsError ||
    totalCountError ||
    todayCountError ||
    sevenDaysError ||
    successError ||
    hybridError ||
    semanticError ||
    keywordError
  ) {
    console.error("Database error in SearchAnalyticsPage:", {
      eventsError,
      totalCountError,
      todayCountError,
      sevenDaysError,
      successError,
      hybridError,
      semanticError,
      keywordError,
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

        {/* Top Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col justify-between">
            <span className="text-sm font-medium text-zinc-400">
              Total Searches
            </span>
            <span className="text-4xl font-extrabold text-white mt-4 tracking-tight">
              {totalSearches.toLocaleString()}
            </span>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col justify-between">
            <span className="text-sm font-medium text-zinc-400">
              Searches Today
            </span>
            <span className="text-4xl font-extrabold text-teal-400 mt-4 tracking-tight">
              {searchesToday.toLocaleString()}
            </span>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col justify-between">
            <span className="text-sm font-medium text-zinc-400">
              Searches (Last 7 Days)
            </span>
            <span className="text-4xl font-extrabold text-blue-400 mt-4 tracking-tight">
              {searchesLast7Days.toLocaleString()}
            </span>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col justify-between">
            <span className="text-sm font-medium text-zinc-400">
              Search Success Rate
            </span>
            <span className="text-4xl font-extrabold text-emerald-400 mt-4 tracking-tight">
              {searchSuccessRate.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Retrieval Mode Breakdown Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-300">
            Top Retrieval Modes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 flex flex-col justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Hybrid Mode
              </span>
              <span className="text-3xl font-bold text-zinc-100 mt-2">
                {hybridSearches.toLocaleString()}
              </span>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 flex flex-col justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Semantic Mode
              </span>
              <span className="text-3xl font-bold text-zinc-100 mt-2">
                {semanticSearches.toLocaleString()}
              </span>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 flex flex-col justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Keyword Mode
              </span>
              <span className="text-3xl font-bold text-zinc-100 mt-2">
                {keywordSearches.toLocaleString()}
              </span>
            </div>
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
                      <tr
                        key={item.query}
                        className="hover:bg-zinc-800/20 transition"
                      >
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
            <h2 className="text-xl font-bold text-white">
              Top 20 Zero-Result Queries
            </h2>
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
                      <tr
                        key={item.query}
                        className="hover:bg-zinc-800/20 transition"
                      >
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
                  <th className="py-3 px-4 w-48 text-right font-mono text-xs">
                    User ID
                  </th>
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
                        <span
                          className={
                            item.results_count === 0
                              ? "text-rose-400 font-semibold"
                              : "text-zinc-300"
                          }
                        >
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
