import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Visit = { id: string; path: string | null; user_agent: string | null; referrer: string | null; created_at: string };

export const AnalyticsTab = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    (async () => {
      const { data, count } = await supabase.from("visitor_logs").select("*", { count: "exact" }).order("created_at", { ascending: false }).limit(100);
      setVisits((data as any) ?? []);
      setTotal(count ?? 0);
    })();
  }, []);

  const today = visits.filter((v) => new Date(v.created_at).toDateString() === new Date().toDateString()).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5"><p className="text-xs uppercase tracking-widest text-muted-foreground">Total visits</p><p className="text-3xl font-display gradient-text">{total}</p></div>
        <div className="glass rounded-2xl p-5"><p className="text-xs uppercase tracking-widest text-muted-foreground">Today</p><p className="text-3xl font-display gradient-text">{today}</p></div>
        <div className="glass rounded-2xl p-5"><p className="text-xs uppercase tracking-widest text-muted-foreground">Showing</p><p className="text-3xl font-display gradient-text">{visits.length}</p></div>
      </div>
      <div className="glass rounded-2xl p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-muted-foreground"><th className="p-2">When</th><th className="p-2">Path</th><th className="p-2">Referrer</th><th className="p-2">User agent</th></tr></thead>
          <tbody>
            {visits.map((v) => (
              <tr key={v.id} className="border-t border-border/50">
                <td className="p-2 whitespace-nowrap">{new Date(v.created_at).toLocaleString()}</td>
                <td className="p-2">{v.path}</td>
                <td className="p-2 max-w-[180px] truncate">{v.referrer || "—"}</td>
                <td className="p-2 max-w-[260px] truncate text-muted-foreground">{v.user_agent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
