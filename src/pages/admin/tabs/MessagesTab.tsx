import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2, Mail, Check } from "lucide-react";
import { toast } from "sonner";
import { ContactMessage } from "@/types/site";

export const MessagesTab = () => {
  const [msgs, setMsgs] = useState<ContactMessage[]>([]);
  const load = async () => {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setMsgs((data as any) ?? []);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    await supabase.from("contact_messages").delete().eq("id", id);
    toast.success("Deleted"); load();
  };

  const markRead = async (id: string) => {
    await supabase.from("contact_messages").update({ is_read: true } as any).eq("id", id);
    load();
  };

  if (msgs.length === 0) return <p className="text-center py-12 text-muted-foreground">No messages yet.</p>;
  return (
    <div className="space-y-3">
      {msgs.map((m) => (
        <div key={m.id} className={`glass rounded-2xl p-5 relative ${!m.is_read ? "ring-2 ring-red-500/40" : ""}`}>
          {!m.is_read && (
            <span className="absolute top-3 right-3 h-3 w-3 rounded-full bg-red-500 animate-pulse" aria-label="Unread" />
          )}
          <div className="flex items-start justify-between gap-3 mb-2 pr-6">
            <div>
              <p className="font-medium flex items-center gap-2">
                {m.name}
                {!m.is_read && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500 text-white">New</span>}
              </p>
              <a href={`mailto:${m.email}`} className="text-sm text-primary hover:underline inline-flex items-center gap-1"><Mail className="h-3 w-3" />{m.email}</a>
            </div>
          </div>
          <p className="text-sm whitespace-pre-wrap">{m.message}</p>
          <div className="mt-3 flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</p>
            <div className="flex gap-2">
              {!m.is_read && (
                <Button size="sm" variant="outline" onClick={() => markRead(m.id)}>
                  <Check className="h-3 w-3 mr-1" /> Mark read
                </Button>
              )}
              <Button size="icon" variant="ghost" onClick={() => remove(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
