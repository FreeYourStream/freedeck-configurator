import c from "clsx";
import { FC } from "react";

const isTauri = "__TAURI_IPC__" in window;
export const Anchor: FC<{
  href: string;
  newTab: boolean;
  className?: string;
}> = ({ children, href, newTab = false, className }) => {
  return isTauri && newTab ? (
    <span
      className={c("cursor-pointer text-primary-400", className)}
      onClick={() =>
        import("@tauri-apps/api/shell").then(({ open }) => open(href))
      }
    >
      {children}
    </span>
  ) : (
    <a
      className={c("cursor-pointer text-primary-400", className)}
      target={newTab ? "_blank" : undefined}
      rel="noreferrer"
      href={href}
    >
      {children}
    </a>
  );
};
