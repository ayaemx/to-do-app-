"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, CheckCheck, X, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NotificationItem } from "./notification-item"
import { NotificationSettings } from "./notification-settings"
import { useNotification } from "@/contexts/notification-context"

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, unreadCount, markAllAsRead } = useNotification()
  const [activeTab, setActiveTab] = useState("all")
  const [showSettings, setShowSettings] = useState(false)

  const unreadNotifications = notifications.filter((n) => !n.read)
  const readNotifications = notifications.filter((n) => n.read)

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case "unread":
        return unreadNotifications
      case "read":
        return readNotifications
      default:
        return notifications
    }
  }

  const filteredNotifications = getFilteredNotifications()

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 notification-overlay bg-black/80 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 border-l-2 border-border shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
                {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-0 h-full">
            {showSettings ? (
              <NotificationSettings onClose={() => setShowSettings(false)} />
            ) : (
              <>
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
                        <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                        <TabsTrigger value="read">Read ({readNotifications.length})</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {unreadCount > 0 && (
                    <Button variant="outline" size="sm" onClick={markAllAsRead} className="w-full">
                      <CheckCheck className="h-4 w-4 mr-2" />
                      Mark All as Read
                    </Button>
                  )}
                </div>

                <ScrollArea className="flex-1 h-[calc(100vh-200px)]">
                  <div className="p-4 space-y-3">
                    <AnimatePresence>
                      {filteredNotifications.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center py-8"
                        >
                          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            {activeTab === "unread" ? "No unread notifications" : "No notifications yet"}
                          </p>
                        </motion.div>
                      ) : (
                        filteredNotifications.map((notification, index) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                          >
                            <NotificationItem notification={notification} />
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
