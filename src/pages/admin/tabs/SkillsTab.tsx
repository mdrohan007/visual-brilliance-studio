import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skill } from "@/types/site";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export const SkillsTab = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const load = async () => {
    const { data } = await supabase.from("skills").select("*").order("sort_order");
    setSkills((data as any) ?? []);
  };
  useEffect(() => { load(); }, []);

  const update = (id: string, patch: Partial<Skill>) => setSkills((arr) => arr.map((s) => s.id === id ? { ...s, ...patch } : s));
  const save = async (s: Skill) => {
    const { error } = await supabase.from("skills").update({ name: s.name, years: s.years, visible: s.visible }).eq("id", s.id);
    error ? toast.error(error.message) : toast.success("Saved");
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    await supabase.from("skills").delete().eq("id", id);
    load();
  };

  return (
    <div className="glass rounded-2xl p-6 space-y-3">
      <h2 className="text-xl font-display mb-2">Skills</h2>
      {skills.map((s) => (
        <div key={s.id} className="grid grid-cols-[1fr_80px_auto_auto_auto] gap-2 items-center">
          <Input value={s.name} onChange={(e) => update(s.id, { name: e.target.value })} />
          <Input type="number" min={0} value={s.years} onChange={(e) => update(s.id, { years: parseInt(e.target.value) || 0 })} />
          <Switch checked={s.visible} onCheckedChange={(v) => update(s.id, { visible: v })} />
          <Button size="sm" variant="outline" onClick={() => save(s)}>Save</Button>
          <Button size="icon" variant="ghost" onClick={() => remove(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      ))}
    </div>
  );
};
