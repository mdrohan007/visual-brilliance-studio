import { Skill } from "@/types/site";
import { skillIcon, skillColor } from "@/lib/icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const Skills = ({ skills }: { skills: Skill[] }) => {
  const visible = skills.filter((s) => s.visible);
  return (
    <section id="skills" className="px-4 py-20 max-w-5xl mx-auto">
      <div className="text-center mb-12 animate-fade-up">
        <h2 className="text-4xl sm:text-5xl font-display mb-3">Skills</h2>
        <p className="text-muted-foreground">Hover an icon to see years of experience</p>
      </div>
      <div className="flex flex-wrap justify-center gap-5 sm:gap-8">
        {visible.map((s) => {
          const Icon = skillIcon[s.icon_key] ?? skillIcon.photoshop;
          const color = skillColor[s.icon_key] ?? "from-primary to-accent";
          return (
            <Tooltip key={s.id}>
              <TooltipTrigger asChild>
                <div className="group relative cursor-pointer">
                  <div className={`h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-card group-hover:shadow-glow group-hover:scale-110 transition-all`}>
                    <Icon className="h-9 w-9 sm:h-11 sm:w-11 text-white" />
                  </div>
                  <p className="text-xs text-center mt-2 text-muted-foreground">{s.name}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent className="glass border-border">
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.years} {s.years === 1 ? "year" : "years"} experience</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </section>
  );
};
