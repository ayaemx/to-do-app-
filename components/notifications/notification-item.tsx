"use client"

import { motion } from "framer-motion"
import { Clock, Trophy, Bell, BookOpen, AlertTriangle, Check, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Notification } from "@/types/notification"
import { useNotification } from "@/contexts/notification-context"
import { formatDistanceToNow } from "date-fns"

interface NotificationItemProps {
  notification: Notification
}

const notificationIcons = {
  "task-due": Clock,
  "task-overdue": AlertTriangle,
  achievement: Trophy,
  system: Bell,
  blog: BookOpen,
  reminder: Bell,
}

const notificationColors = {
  "task-due": "text-blue-600 bg-blue-100 dark:bg-blue-900/20",
  "task-overdue": "text-red-600 bg-red-100 dark:bg-red-900/20",
  achievement: "text-green-600 bg-green-100 dark:bg-green-900/20",
  system: "text-purple-600 bg-purple-100 dark:bg-purple-900/20",
  blog: "text-orange-600 bg-orange-100 dark:bg-orange-900/20",
  reminder: "text-gray-600 bg-gray-100 dark:bg-gray-900/20",
}

const priorityColors = {
  low: "border-green-200 dark:border-green-800",
  medium: "border-yellow-200 dark:border-yellow-800",
  high: "border-orange-200 dark:border-orange-800",
  urgent: "border-red-200 dark:border-red-800",
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const { markAsRead, deleteNotification } = useNotification()
  const Icon = notificationIcons[notification.type]

  const handleMarkAsRead = () => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
  }

  const handleDelete = () => {
    deleteNotification(notification.id)
  }

  const handleClick = () => {
    handleMarkAsRead()
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        className={`cursor-pointer transition-all hover:shadow-md bg-white ${
          !notification.read ? "border-l-4 border-l-primary" : ""
        } ${notification.metadata?.priority ? priorityColors[notification.metadata.priority] : ""}`}
        onClick={handleClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${notificationColors[notification.type]}`}>
              <Icon className="h-4 w-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className={`font-medium text-sm ${!notification.read ? "font-semibold" : ""}`}>
                    {notification.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {!notification.read && (
                    <Button variant="ghost" size="sm" onClick={(e) => (e.stopPropagation(), handleMarkAsRead())}>
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={(e) => (e.stopPropagation(), handleDelete())}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {notification.type.replace("-", " ")}
                  </Badge>
                  {notification.metadata?.priority && (
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        notification.metadata.priority === "urgent"
                          ? "border-red-200 text-red-700 dark:border-red-800 dark:text-red-300"
                          : notification.metadata.priority === "high"
                            ? "border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-300"
                            : ""
                      }`}
                    >
                      {notification.metadata.priority}
                    </Badge>
                  )}
                </div>

                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
