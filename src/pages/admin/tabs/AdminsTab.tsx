import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, UserPlus } from "lucide-react";

type Row = { user_id: string; role: string; is_primary?: boolean };

export const AdminsTab = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const load = async () => {
    const { data } = await supabase.from("user_roles").select("user_id, role, is_primary").eq("role", "admin");
    setRows((data as any) ?? []);
  };
  useEffect(() => { load(); }, []);

  const invite = async () => {
    if (!email || pwd.length < 6) return toast.error("Email + password (6+) required");
    // Sign up creates the user; trigger inserts as 'user'. Promote after.
    const { data, error } = await supabase.auth.signUp({ email, password: pwd, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    if (error) return toast.error(error.message);
    if (data.user) {
      await supabase.from("user_roles").insert({ user_id: data.user.id, role: "admin" });
    }
    toast.success("Admin created. They can sign in.");
    setEmail(""); setPwd(""); load();
  };

  const revoke = async (uid: string) => {
    if (!confirm("Revoke admin?")) return;
    const { error } = await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", "admin");
    if (error) return toast.error(error.message);
    toast.success("Revoked"); load();
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-display">Add admin</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><Label>Password</Label><Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} /></div>
        </div>
        <Button onClick={invite} className="gradient-hero text-primary-foreground"><UserPlus className="h-4 w-4 mr-2" /> Create admin</Button>
      </div>
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-display mb-4">Current admins ({rows.length})</h2>
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.user_id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
              <span className="font-mono text-xs truncate">
                {r.user_id}
                {r.is_primary && <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] uppercase tracking-widest">Primary</span>}
              </span>
              {!r.is_primary && (
                <Button size="icon" variant="ghost" onClick={() => revoke(r.user_id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
