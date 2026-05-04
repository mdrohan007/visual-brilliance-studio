import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Photo } from "@/types/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Upload } from "lucide-react";

export const PhotosTab = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("photos").select("*").order("created_at", { ascending: false });
    setPhotos((data as any) ?? []);
  };
  useEffect(() => { load(); }, []);

  const upload = async (file: File) => {
    setBusy(true);
    const ext = file.name.split(".").pop();
    const path = `photo-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("photos").upload(path, file);
    if (upErr) { toast.error(upErr.message); setBusy(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("photos").getPublicUrl(path);
    const { error } = await supabase.from("photos").insert({ title: title || null, image_url: publicUrl, storage_path: path });
    setBusy(false);
    if (error) return toast.error(error.message);
    setTitle("");
    toast.success("Photo uploaded");
    load();
  };

  const remove = async (p: Photo) => {
    if (!confirm("Delete this photo?")) return;
    if (p.storage_path) await supabase.storage.from("photos").remove([p.storage_path]);
    await supabase.from("photos").delete().eq("id", p.id);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-display">Upload photo</h2>
        <div className="grid sm:grid-cols-[1fr_auto] gap-3">
          <div><Label>Title (optional)</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="flex items-end">
            <Label className="cursor-pointer w-full">
              <input type="file" accept="image/*" className="hidden" disabled={busy} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
              <span className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full gradient-hero text-primary-foreground w-full"><Upload className="h-4 w-4" /> {busy ? "Uploading..." : "Choose file"}</span>
            </Label>
          </div>
        </div>
      </div>

      <div className="pin-grid">
        {photos.map((p) => (
          <div key={p.id} className="pin-item relative group rounded-2xl overflow-hidden shadow-card">
            <img src={p.image_url} alt={p.title ?? ""} className="w-full h-auto" />
            <button onClick={() => remove(p)} className="absolute top-2 right-2 h-9 w-9 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
