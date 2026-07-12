"use client";

import type { ReactNode } from "react";
import { usePathname } from "fumadocs-core/framework";
import { useTreePath } from "fumadocs-ui/contexts/tree";
import {
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
} from "fumadocs-ui/components/sidebar/base";
import type * as PageTree from "fumadocs-core/page-tree";
import { PACKAGE_THEMES } from "../lib/package-themes";

function normalize(urlOrPath: string) {
  if (urlOrPath.length > 1 && urlOrPath.endsWith("/")) {
    return urlOrPath.slice(0, -1);
  }
  return urlOrPath;
}

function isActive(href: string, pathname: string) {
  return normalize(href) === normalize(pathname);
}

function slugFromFolder(item: PageTree.Folder): string | undefined {
  if (item.index?.url) {
    return item.index.url.split("/").filter(Boolean)[0];
  }
  if (typeof item.name === "string") return item.name;
  return undefined;
}

export function PackageSidebarFolder({
  item,
  children,
}: {
  item: PageTree.Folder;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const path = useTreePath();
  const slug = slugFromFolder(item);
  const theme = slug ? PACKAGE_THEMES[slug] : undefined;
  const Icon = theme?.Icon;

  const icon = Icon ? (
    <Icon className="size-4 shrink-0" style={{ color: theme?.primary }} />
  ) : null;

  const label = (
    <span className="inline-flex items-center gap-2">
      {icon}
      {item.name}
    </span>
  );

  // Make the trigger/link a flex row so the chevron (rendered by Fumadocs with
  // `ms-auto`) is pushed to the right instead of wrapping below the label.
  const rowClass = "flex w-full items-center";

  return (
    <SidebarFolder
      collapsible={item.collapsible}
      active={path.includes(item)}
      defaultOpen={item.defaultOpen}
    >
      {item.index ? (
        <SidebarFolderLink
          href={item.index.url}
          active={isActive(item.index.url, pathname)}
          external={item.index.external}
          className={rowClass}
        >
          {label}
        </SidebarFolderLink>
      ) : (
        <SidebarFolderTrigger className={rowClass}>{label}</SidebarFolderTrigger>
      )}
      <SidebarFolderContent>{children}</SidebarFolderContent>
    </SidebarFolder>
  );
}
