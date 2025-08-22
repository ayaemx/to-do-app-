"use client"

import { CheckSquare, Calendar, FolderTree, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const mobileMenuItems = [
  { icon: CheckSquare, label: "Tasks", href: "/tasks" },
  { icon: FolderTree, label: "Folders", href: "/folders" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: BookOpen, label: "Blog", href: "/blog" },
]

export function MobileNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t">
      <div className="flex items-center justify-around py-2">
        {mobileMenuItems.map((item) => (
          <Link key={item.label} href={item.href}>
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2">
              <item.icon className="h-4 w-4" />
              <span className="text-xs">{item.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}
