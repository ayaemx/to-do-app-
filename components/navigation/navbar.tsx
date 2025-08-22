"use client"

import { useState } from "react"
import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { NotificationPanel } from "@/components/notifications/notification-panel"
import { useNotification } from "@/contexts/notification-context"
import Link from "next/link"
import { CoursologyLogo } from "@/components/icons/coursology-logo"

export function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false)
  const { unreadCount } = useNotification()

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900">
        <div className="flex h-14 items-center justify-between w-full px-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <CoursologyLogo />
            </Link>
          </div>

          <div className="flex items-center space-x-2 ml-auto">
            <Button variant="ghost" size="icon" className="h-9 w-9 relative" onClick={() => setShowNotifications(true)}>
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>

            <ThemeToggle />

            <Button variant="ghost" size="icon" className="h-9 w-9">
              <User className="h-4 w-4" />
              <span className="sr-only">Profile</span>
            </Button>
          </div>
        </div>
      </nav>

      <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </>
  )
}
