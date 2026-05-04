import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Send } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  message: z.string().trim().min(5, "Tell me a bit more").max(2000),
});

export const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const payload = { name: parsed.data.name, email: parsed.data.email, message: parsed.data.message };
    const { error } = await supabase.from("contact_messages").insert(payload);
    if (!error) {
      // Fire-and-forget email notification
      supabase.functions.invoke("notify-contact", { body: payload }).catch(() => {});
    }
    setLoading(false);
    if (error) {
      toast.error("Could not send. Try again.");
    } else {
      toast.success("Message sent! I'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    }
  };

  return (
    <section id="contact" className="px-4 py-20 max-w-2xl mx-auto">
      <div className="text-center mb-10 animate-fade-up">
        <h2 className="text-4xl sm:text-5xl font-display mb-3">Get in touch</h2>
        <p className="text-muted-foreground">Have a project in mind? Drop a message.</p>
      </div>
      <form onSubmit={submit} className="glass rounded-3xl p-6 sm:p-8 space-y-5 shadow-card">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell me about your project..." />
        </div>
        <Button type="submit" disabled={loading} className="w-full gradient-hero text-primary-foreground shadow-glow rounded-full">
          <Send className="h-4 w-4 mr-2" /> {loading ? "Sending..." : "Send message"}
        </Button>
      </form>
    </section>
  );
};
