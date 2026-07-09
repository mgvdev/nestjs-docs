import { type CSSProperties, type ComponentType } from "react";
import { defineConfig } from "fumapress";
import { createDocsLayoutPage } from "fumapress/layouts/docs";
import { fumadocsMdx } from "fumapress/adapters/mdx";
import { oramaSearchPlugin } from "fumapress/plugins/orama-search";
import { llmsPlugin } from "fumapress/plugins/llms.txt";
import { takumiPlugin } from "fumapress/plugins/takumi";
import { Boxes, Rocket, Sparkles } from "lucide-react";
import { docs } from "./.source/server";

// Per-package theming for the sidebar section switcher: an accent color (used as
// the Fumadocs primary color across the whole layout when that section is active)
// and an icon shown in the switcher. Keyed by the section slug (content/<slug>/).
type PackageTheme = {
  primary: string;
  foreground: string;
  Icon: ComponentType<{ className?: string; style?: CSSProperties }>;
};

const PACKAGE_THEMES: Record<string, PackageTheme> = {
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
};

const slugOf = (url: string) => url.split("/").filter(Boolean)[0];

export default defineConfig({
  content: docs.toFumadocsSource(),
  mode: "static",
  site: {
    name: "nest.mgvdev.io",
    baseUrl: "https://nest.mgvdev.io",
    git: {
      user: "mgvdev",
      repo: "nest.mgvdev.io",
      branch: "main",
    },
  },
  meta: {
    root() {
      return (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Geist:ital,wght@0,100..900;1,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
            rel="stylesheet"
          />
          <script
            defer
            data-domain="nest.mgvdev.io"
            src="https://analytics.framepeel.mgvdev.io/js/script.outbound-links.js"
          />
        </>
      );
    },
  },
})
  .plugins(oramaSearchPlugin(), llmsPlugin(), takumiPlugin())
  .adapters(fumadocsMdx())
  .layouts({
    page: createDocsLayoutPage({
      render(page) {
        const section = page.slugs?.[0];
        const theme = section ? PACKAGE_THEMES[section] : undefined;
        return {
          layoutProps: {
            ...(theme && {
              containerProps: {
                style: {
                  "--color-fd-primary": theme.primary,
                  "--color-fd-primary-foreground": theme.foreground,
                } as CSSProperties,
              },
            }),
            tabs: {
              transform(tab) {
                const slug = slugOf(tab.url);
                const t = slug ? PACKAGE_THEMES[slug] : undefined;
                if (!t) return tab;
                const Icon = t.Icon;
                return {
                  ...tab,
                  icon: <Icon className="size-5" style={{ color: t.primary }} />,
                };
              },
            },
          },
        };
      },
    }),
  });
