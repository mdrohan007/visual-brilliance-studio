import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skill } from "@/types/site";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { skillIcon } from "@/lib/icons";

const ICON_KEYS = Object.keys(skillIcon);

export const SkillsTab = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({ name: "", icon_key: ICON_KEYS[0], years: 1 });
  const load = async () => {
    const { data } = await supabase.from("skills").select("*").order("sort_order");
    setSkills((data as any) ?? []);
  };
  useEffect(() => { load(); }, []);

  const update = (id: string, patch: Partial<Skill>) =>
    setSkills((arr) => arr.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const save = async (s: Skill) => {
    const { error } = await supabase
      .from("skills")
      .update({ name: s.name, years: s.years, visible: s.visible, icon_key: s.icon_key })
      .eq("id", s.id);
    error ? toast.error(error.message) : toast.success("Saved");
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    await supabase.from("skills").delete().eq("id", id);
    load();
  };

  const add = async () => {
    if (!newSkill.name.trim()) return toast.error("Name required");
    const { error } = await supabase.from("skills").insert({
      name: newSkill.name.trim(),
      icon_key: newSkill.icon_key,
      years: newSkill.years,
      visible: true,
      sort_order: skills.length,
    });
    if (error) return toast.error(error.message);
    setNewSkill({ name: "", icon_key: ICON_KEYS[0], years: 1 });
    toast.success("Skill added");
    load();
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-display flex items-center gap-2"><Plus className="h-5 w-5" /> Add new skill</h2>
        <div className="grid sm:grid-cols-[1fr_180px_100px_auto] gap-3 items-end">
          <div>
            <Label>Name</Label>
            <Input value={newSkill.name} onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })} placeholder="After Effects" />
          </div>
          <div>
            <Label>Icon</Label>
            <Select value={newSkill.icon_key} onValueChange={(v) => setNewSkill({ ...newSkill, icon_key: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ICON_KEYS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Years</Label>
            <Input type="number" min={0} value={newSkill.years} onChange={(e) => setNewSkill({ ...newSkill, years: parseInt(e.target.value) || 0 })} />
          </div>
          <Button onClick={add} className="gradient-hero text-primary-foreground">Add</Button>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 space-y-3">
        <h2 className="text-xl font-display mb-2">Manage skills</h2>
        {skills.length === 0 && <p className="text-muted-foreground text-sm">No skills yet.</p>}
        {skills.map((s) => (
          <div key={s.id} className="grid grid-cols-1 sm:grid-cols-[1fr_160px_90px_auto_auto_auto] gap-2 items-center">
            <Input value={s.name} onChange={(e) => update(s.id, { name: e.target.value })} placeholder="Name" />
            <Select value={s.icon_key} onValueChange={(v) => update(s.id, { icon_key: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ICON_KEYS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
            </Select>
            <Input type="number" min={0} value={s.years} onChange={(e) => update(s.id, { years: parseInt(e.target.value) || 0 })} />
            <Switch checked={s.visible} onCheckedChange={(v) => update(s.id, { visible: v })} />
            <Button size="sm" variant="outline" onClick={() => save(s)}>Save</Button>
            <Button size="icon" variant="ghost" onClick={() => remove(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
};
