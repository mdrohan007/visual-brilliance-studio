import { useEffect, useState } from "react";
import { Video, Photo } from "@/types/site";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getYouTubeEmbed, getYouTubeThumb } from "@/lib/youtube";
import { Play, Crown, Sparkles, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export const Videos = ({ videos }: { videos: Video[] }) => {
  const { isAdmin } = useAuth();
  const noCtx = (e: React.MouseEvent) => { if (!isAdmin) e.preventDefault(); };
  const [open, setOpen] = useState<Video | null>(null);
  const [photoOpen, setPhotoOpen] = useState<Photo | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const premium = videos.filter((v) => v.category === "premium");
  const standard = videos.filter((v) => v.category === "standard");

  useEffect(() => {
    supabase
      .from("photos")
      .select("*")
      .order("sort_order")
      .order("created_at", { ascending: false })
      .then(({ data }) => setPhotos((data as any) ?? []));
  }, []);

  const grid = (list: Video[]) =>
    list.length === 0 ? (
      <p className="text-center text-muted-foreground py-12">No videos yet.</p>
    ) : (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map((v, i) => {
          const thumb = v.thumbnail_url || (v.source === "youtube" ? getYouTubeThumb(v.url) : null);
          return (
            <motion.button
              key={v.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => setOpen(v)}
              className="group relative w-full overflow-hidden rounded-2xl shadow-card hover:shadow-glow transition-all bg-card aspect-video text-left"
            >
              {thumb ? (
                <img src={thumb} alt={v.title || "Video"} loading="lazy" draggable={false} onContextMenu={noCtx} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none" />
              ) : (
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <Play className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-16 w-16 rounded-full glass flex items-center justify-center shadow-glow">
                  <Play className="h-7 w-7 fill-foreground" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-sm sm:text-base font-medium text-foreground line-clamp-2">{v.title || "Untitled"}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    );

  const photoGrid = () =>
    photos.length === 0 ? (
      <p className="text-center text-muted-foreground py-12">No photos yet.</p>
    ) : (
      <div className="pin-grid">
        {photos.map((p, i) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            onClick={() => setPhotoOpen(p)}
            className="pin-item block w-full overflow-hidden rounded-2xl shadow-card hover:shadow-glow transition-all"
          >
            <img src={p.image_url} alt={p.title || "Photo"} loading="lazy" draggable={false} onContextMenu={noCtx} className="w-full h-auto block select-none" />
          </motion.button>
        ))}
      </div>
    );

  return (
    <section className="px-4 py-16 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl sm:text-5xl font-display mb-3">Portfolio</h2>
        <p className="text-muted-foreground">Cinematic edits, motion graphics, and visuals</p>
      </div>

      <Tabs defaultValue="premium" className="w-full">
        <TabsList className="mx-auto mb-8 flex w-fit gap-1 glass rounded-full p-1">
          <TabsTrigger value="premium" className="rounded-full px-5 gap-2 data-[state=active]:gradient-hero data-[state=active]:text-primary-foreground">
            <Crown className="h-4 w-4" /> Premium
          </TabsTrigger>
          <TabsTrigger value="standard" className="rounded-full px-5 gap-2 data-[state=active]:gradient-hero data-[state=active]:text-primary-foreground">
            <Sparkles className="h-4 w-4" /> Standard
          </TabsTrigger>
          <TabsTrigger value="photos" className="rounded-full px-5 gap-2 data-[state=active]:gradient-hero data-[state=active]:text-primary-foreground">
            <ImageIcon className="h-4 w-4" /> Photos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="premium">{grid(premium)}</TabsContent>
        <TabsContent value="standard">{grid(standard)}</TabsContent>
        <TabsContent value="photos">{photoGrid()}</TabsContent>
      </Tabs>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-border">
          {open && (
            <div className="aspect-video w-full bg-black">
              {open.source === "youtube" ? (
                <iframe
                  src={(getYouTubeEmbed(open.url) ?? "") + "?autoplay=1&rel=0&modestbranding=1"}
                  title={open.title || "Video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <video
                  src={open.url}
                  controls
                  autoPlay
                  playsInline
                  onContextMenu={noCtx}
                  controlsList={isAdmin ? undefined : "nodownload noplaybackrate noremoteplayback"}
                  disablePictureInPicture={!isAdmin}
                  className="w-full h-full"
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!photoOpen} onOpenChange={(o) => !o && setPhotoOpen(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background border-border">
          {photoOpen && (
            <img src={photoOpen.image_url} alt={photoOpen.title || "Photo"} draggable={false} onContextMenu={noCtx} className="w-full h-auto select-none" />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
