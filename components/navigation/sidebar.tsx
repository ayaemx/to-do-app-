"use client"

import {
  Calendar,
  FolderTree,
  CheckSquare,
  BookOpen,
  Home,
  Pin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTask } from "@/contexts/task-context"
import { useEffect, useMemo, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"


const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks" },
  { icon: FolderTree, label: "Folders", href: "/folders" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: BookOpen, label: "Blog", href: "/blog" },
]

export function Sidebar() {
  const { tasks, loading } = useTask()
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    if (!loading) {
      setInitialLoad(false)
    }
  }, [loading])

  const pinnedTasks = useMemo(
    () => tasks.filter((task) => task.pinned),
    [tasks]
  )
  const [open, setOpen] = useState(true)
  const pathname = usePathname()

  return (
    <aside
      className={`hidden md:flex fixed left-0 top-[93px] h-[calc(100vh-93px)] z-40 transition-all duration-300
        ${open ? "w-64" : "w-16"}
        flex-col bg-card shadow-sm`}
    >
      {/* Toggle Button */}
      <div className="flex items-center gap-2 px-3 py-4">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          className="flex items-center justify-center h-9 w-9 rounded-full bg-transparent hover:bg-accent border border-border shadow transition-all"
        >
          {open ? (
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
        {open && (
          <span className="ml-2 text-xs font-bold text-muted-foreground tracking-wide whitespace-nowrap">
            obsessed with success
          </span>
        )}
      </div>
      {/* Navigation and Pinned Tasks */}
      <div className={`flex-1 px-2 ${open ? "" : "px-0"} flex flex-col`}>
        <nav className="space-y-1 mb-6">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.label} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${open ? "" : "px-2"} rounded-lg transition-all duration-200 ${
                    isActive ? "bg-muted-active" : "hover:bg-muted"
                  } sidebar-btn`}
                  size="sm"
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {open && <span className="truncate">{item.label}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>
        {initialLoad ? (
          <div className={`mb-4 ${open ? "mt-8" : "mt-6 flex flex-col items-center"}`}>
            <div className={`flex items-center gap-2 mb-2 text-muted-foreground font-normal text-xs uppercase tracking-wider ${open ? "" : "justify-center flex-col"}`}>
              <Pin className="h-4 w-4 text-muted-foreground" />
              {open && "Pinned Tasks"}
            </div>
            <ul className={`space-y-2 w-full ${open ? "" : "flex flex-col items-center"}`}>
              {[...Array(3)].map((_, i) => (
                <li key={i} className="w-full">
                  <Skeleton className={`h-8 w-full ${!open ? "max-w-[32px]" : ""}`} />
                </li>
              ))}
            </ul>
          </div>
        ) : pinnedTasks.length > 0 && (
          <div className={`mb-4 ${open ? "mt-8" : "mt-6 flex flex-col items-center"}`}>
            <div className={`flex items-center gap-2 mb-2 text-muted-foreground font-normal text-xs uppercase tracking-wider ${open ? "" : "justify-center flex-col"}`}>
              <Pin className="h-4 w-4 text-muted-foreground" />
              {open && "Pinned Tasks"}
            </div>
            <ul className={`space-y-1 w-full ${open ? "" : "flex flex-col items-center"}`}>
              {pinnedTasks.map((task) => (
                <li key={task.id} className="w-full">
                  <Link href={`/tasks?taskId=${task.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`truncate rounded-md w-full ${open ? "justify-start text-left px-3" : "justify-center px-0"} ${!open ? "min-h-[32px] min-w-[32px] max-w-[32px] mx-auto" : ""} text-muted-foreground`}
                      title={task.title}
                    >
                      {open ? (
                        <span className="truncate">{task.title}</span>
                      ) : (
                        <span className="sr-only">{task.title}</span>
                      )}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  )
}
