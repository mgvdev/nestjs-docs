import type { CSSProperties } from "react";
import { defineConfig } from "fumapress";
import { createDocsLayoutPage } from "fumapress/layouts/docs";
import { fumadocsMdx } from "fumapress/adapters/mdx";
import { oramaSearchPlugin } from "fumapress/plugins/orama-search";
import { llmsPlugin } from "fumapress/plugins/llms.txt";
import { takumiPlugin } from "fumapress/plugins/takumi";
import { docs } from "./.source/server";
import { PACKAGE_THEMES } from "./src/lib/package-themes";
import { PackageSidebarFolder } from "./src/components/package-sidebar-folder";

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
            sidebar: {
              components: {
                Folder: PackageSidebarFolder,
              },
            },
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
