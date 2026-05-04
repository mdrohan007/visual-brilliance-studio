import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Video } from "@/types/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Upload, Link2 } from "lucide-react";
import { getYouTubeThumb } from "@/lib/youtube";

export const VideosTab = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"premium" | "standard">("standard");
  const [ytUrl, setYtUrl] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
    setVideos((data as any) ?? []);
  };
  useEffect(() => { load(); }, []);

  const addYoutube = async () => {
    if (!ytUrl.trim()) return toast.error("Paste a YouTube URL");
    setBusy(true);
    const { error } = await supabase.from("videos").insert({
      title: title || null,
      category,
      source: "youtube",
      url: ytUrl.trim(),
      thumbnail_url: getYouTubeThumb(ytUrl.trim()),
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setTitle(""); setYtUrl("");
    toast.success("Video added");
    load();
  };

  const upload = async (file: File) => {
    setBusy(true);
    const ext = file.name.split(".").pop();
    const path = `video-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("videos").upload(path, file);
    if (upErr) { toast.error(upErr.message); setBusy(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("videos").getPublicUrl(path);
    const { error } = await supabase.from("videos").insert({
      title: title || null, category, source: "file", url: publicUrl, storage_path: path,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setTitle("");
    toast.success("Video uploaded");
    load();
  };

  const remove = async (v: Video) => {
    if (!confirm("Delete this video?")) return;
    if (v.storage_path) await supabase.storage.from("videos").remove([v.storage_path]);
    await supabase.from("videos").delete().eq("id", v.id);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-display">Add video</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={(v: any) => setCategory(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid sm:grid-cols-[1fr_auto] gap-2">
          <Input placeholder="YouTube URL (https://youtu.be/...)" value={ytUrl} onChange={(e) => setYtUrl(e.target.value)} />
          <Button onClick={addYoutube} disabled={busy} className="gradient-hero text-primary-foreground"><Link2 className="h-4 w-4 mr-2" /> Add YouTube</Button>
        </div>
        <div className="text-center text-xs text-muted-foreground">— or upload a file —</div>
        <Label className="cursor-pointer block">
          <input type="file" accept="video/*" className="hidden" disabled={busy} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          <span className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full border border-border hover:bg-muted w-full"><Upload className="h-4 w-4" /> {busy ? "Working..." : "Choose video file"}</span>
        </Label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((v) => {
          const thumb = v.thumbnail_url || (v.source === "youtube" ? getYouTubeThumb(v.url) : null);
          return (
            <div key={v.id} className="relative group rounded-2xl overflow-hidden shadow-card glass">
              {thumb ? <img src={thumb} alt={v.title ?? ""} className="w-full aspect-video object-cover" /> : <div className="aspect-video bg-muted" />}
              <div className="p-3">
                <p className="text-sm font-medium line-clamp-1">{v.title || "Untitled"}</p>
                <p className="text-xs text-muted-foreground capitalize">{v.category} · {v.source}</p>
              </div>
              <button onClick={() => remove(v)} className="absolute top-2 right-2 h-9 w-9 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><Trash2 className="h-4 w-4" /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
