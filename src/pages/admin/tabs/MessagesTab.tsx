import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2, Mail } from "lucide-react";
import { toast } from "sonner";

type Msg = { id: string; name: string; email: string; message: string; created_at: string };

export const MessagesTab = () => {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const load = async () => {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setMsgs((data as any) ?? []);
  };
  useEffect(() => { load(); }, []);
  const remove = async (id: string) => {
    await supabase.from("contact_messages").delete().eq("id", id);
    toast.success("Deleted"); load();
  };
  if (msgs.length === 0) return <p className="text-center py-12 text-muted-foreground">No messages yet.</p>;
  return (
    <div className="space-y-3">
      {msgs.map((m) => (
        <div key={m.id} className="glass rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <p className="font-medium">{m.name}</p>
              <a href={`mailto:${m.email}`} className="text-sm text-primary hover:underline inline-flex items-center gap-1"><Mail className="h-3 w-3" />{m.email}</a>
            </div>
            <Button size="icon" variant="ghost" onClick={() => remove(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
          <p className="text-sm whitespace-pre-wrap">{m.message}</p>
          <p className="text-xs text-muted-foreground mt-2">{new Date(m.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};
