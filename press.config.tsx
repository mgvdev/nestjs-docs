import { defineConfig } from "fumapress";
import { fumadocsMdx } from "fumapress/adapters/mdx";
import { oramaSearchPlugin } from "fumapress/plugins/orama-search";
import { llmsPlugin } from "fumapress/plugins/llms.txt";
import { takumiPlugin } from "fumapress/plugins/takumi";
import { docs } from "./.source/server";

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
        </>
      );
    },
  },
})
  .plugins(oramaSearchPlugin(), llmsPlugin(), takumiPlugin())
  .adapters(fumadocsMdx());
