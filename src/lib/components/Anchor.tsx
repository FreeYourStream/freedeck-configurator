import { FC } from "react"

const isTauri = ("__TAURI_IPC__" in window)
export const Anchor: FC<{ href: string, newTab: boolean, className?: string }> = ({ children, href, newTab = false, className }) => {
    return isTauri && newTab
        ? <div className={className} onClick={() => import("@tauri-apps/api/shell").then(({ open }) => open(href))}>
            {children}
        </div>
        : <a className={className} target={newTab ? "_blank" : undefined} href={href}>
            {children}
        </a>
}