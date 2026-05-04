import { useState } from "react";
import { Photo, Video } from "@/types/site";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getYouTubeEmbed, getYouTubeThumb } from "@/lib/youtube";
import { Play, Crown, Sparkles } from "lucide-react";

export const Portfolio = ({ photos, videos }: { photos: Photo[]; videos: Video[] }) => {
  const [openVideo, setOpenVideo] = useState<Video | null>(null);
  const [openPhoto, setOpenPhoto] = useState<Photo | null>(null);
  const premium = videos.filter((v) => v.category === "premium");
  const standard = videos.filter((v) => v.category === "standard");

  const renderVideos = (list: Video[]) =>
    list.length === 0 ? (
      <p className="text-center text-muted-foreground py-12">No videos yet.</p>
    ) : (
      <div className="pin-grid">
        {list.map((v) => {
          const thumb = v.thumbnail_url || (v.source === "youtube" ? getYouTubeThumb(v.url) : null);
          return (
            <button
              key={v.id}
              onClick={() => setOpenVideo(v)}
              className="pin-item group relative w-full overflow-hidden rounded-2xl shadow-card hover:shadow-glow transition-all"
            >
              {thumb ? (
                <img src={thumb} alt={v.title || "Video"} loading="lazy" className="w-full h-auto" />
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Play className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/0 to-background/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p className="text-sm font-medium text-foreground line-clamp-2">{v.title || "Untitled"}</p>
              </div>
              <div className="absolute top-2 right-2 h-9 w-9 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="h-4 w-4 fill-foreground" />
              </div>
            </button>
          );
        })}
      </div>
    );

  return (
    <section id="portfolio" className="px-4 py-20 max-w-7xl mx-auto">
      <div className="text-center mb-12 animate-fade-up">
        <h2 className="text-4xl sm:text-5xl font-display mb-3">Portfolio</h2>
        <p className="text-muted-foreground">A curated collection of recent work</p>
      </div>

      <Tabs defaultValue="video" className="w-full">
        <TabsList className="mx-auto mb-8 flex w-fit glass rounded-full p-1">
          <TabsTrigger value="video" className="rounded-full px-6 data-[state=active]:gradient-hero data-[state=active]:text-primary-foreground">Video</TabsTrigger>
          <TabsTrigger value="photo" className="rounded-full px-6 data-[state=active]:gradient-hero data-[state=active]:text-primary-foreground">Photo</TabsTrigger>
        </TabsList>

        <TabsContent value="video">
          <Tabs defaultValue="premium" className="w-full">
            <TabsList className="mx-auto mb-6 flex w-fit gap-1 bg-muted/50 rounded-full p-1">
              <TabsTrigger value="premium" className="rounded-full px-5 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-card">
                <Crown className="h-4 w-4" /> Premium
              </TabsTrigger>
              <TabsTrigger value="standard" className="rounded-full px-5 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-card">
                <Sparkles className="h-4 w-4" /> Standard
              </TabsTrigger>
            </TabsList>
            <TabsContent value="premium">{renderVideos(premium)}</TabsContent>
            <TabsContent value="standard">{renderVideos(standard)}</TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="photo">
          {photos.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No photos yet.</p>
          ) : (
            <div className="pin-grid">
              {photos.map((p) => (
                <button key={p.id} onClick={() => setOpenPhoto(p)} className="pin-item w-full block overflow-hidden rounded-2xl shadow-card hover:shadow-glow transition-all group">
                  <img src={p.image_url} alt={p.title || "Photo"} loading="lazy" className="w-full h-auto group-hover:scale-105 transition-transform duration-500" />
                </button>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!openVideo} onOpenChange={(o) => !o && setOpenVideo(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background">
          {openVideo && (
            <div className="aspect-video w-full bg-black">
              {openVideo.source === "youtube" ? (
                <iframe src={getYouTubeEmbed(openVideo.url) ?? ""} title={openVideo.title || "Video"} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
              ) : (
                <video src={openVideo.url} controls autoPlay className="w-full h-full" />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!openPhoto} onOpenChange={(o) => !o && setOpenPhoto(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background">
          {openPhoto && <img src={openPhoto.image_url} alt={openPhoto.title || "Photo"} className="w-full h-auto" />}
        </DialogContent>
      </Dialog>
    </section>
  );
};
