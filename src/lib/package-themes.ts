import type { ComponentType, CSSProperties } from "react";
import { Boxes, Rocket, Sparkles, Zap } from "lucide-react";

export type PackageTheme = {
  primary: string;
  foreground: string;
  Icon: ComponentType<{ className?: string; style?: CSSProperties }>;
};

export const PACKAGE_THEMES: Record<string, PackageTheme> = {
  "nest-boost": {
    primary: "hsl(346, 84%, 55%)",
    foreground: "hsl(0, 0%, 100%)",
    Icon: Rocket,
  },
  "nestjs-ai": {
    primary: "hsl(258, 82%, 62%)",
    foreground: "hsl(0, 0%, 100%)",
    Icon: Sparkles,
  },
  nestkit: {
    primary: "hsl(173, 75%, 40%)",
    foreground: "hsl(0, 0%, 100%)",
    Icon: Boxes,
  },
  "nestjs-bun-adapter": {
    primary: "hsl(32, 95%, 55%)",
    foreground: "hsl(0, 0%, 100%)",
    Icon: Zap,
  },
};
