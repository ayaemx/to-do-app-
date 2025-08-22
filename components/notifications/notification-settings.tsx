"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNotification } from "@/contexts/notification-context"
import { useState } from "react"

interface NotificationSettingsProps {
  onClose: () => void
}

export function NotificationSettings({ onClose }: NotificationSettingsProps) {
  const { settings, updateSettings, showToast } = useNotification()
  const [localSettings, setLocalSettings] = useState(settings)

  const handleSave = () => {
    updateSettings(localSettings)
    showToast({
      type: "success",
      title: "Settings Saved",
      message: "Your notification preferences have been updated",
    })
    onClose()
  }

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background"
    >
      <div className="p-0">
        <div className="border-b p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">Notification Settings</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Task Notifications</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Task Reminders</Label>
                <p className="text-sm text-muted-foreground">Get notified before tasks are due</p>
              </div>
              <Switch
                checked={localSettings.taskReminders}
                onCheckedChange={(checked) => handleSettingChange("taskReminders", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Overdue Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified when tasks become overdue</p>
              </div>
              <Switch
                checked={localSettings.overdueAlerts}
                onCheckedChange={(checked) => handleSettingChange("overdueAlerts", checked)}
              />
            </div>

            {localSettings.taskReminders && (
              <div className="space-y-2">
                <Label>Reminder Time</Label>
                <Select
                  value={localSettings.reminderTime.toString()}
                  onValueChange={(value) => handleSettingChange("reminderTime", Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour before</SelectItem>
                    <SelectItem value="6">6 hours before</SelectItem>
                    <SelectItem value="24">24 hours before</SelectItem>
                    <SelectItem value="48">48 hours before</SelectItem>
                    <SelectItem value="168">1 week before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Content Notifications</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Achievement Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified about your achievements</p>
              </div>
              <Switch
                checked={localSettings.achievementNotifications}
                onCheckedChange={(checked) => handleSettingChange("achievementNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Blog Updates</Label>
                <p className="text-sm text-muted-foreground">Get notified about new blog posts</p>
              </div>
              <Switch
                checked={localSettings.blogUpdates}
                onCheckedChange={(checked) => handleSettingChange("blogUpdates", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>System Updates</Label>
                <p className="text-sm text-muted-foreground">Get notified about system updates and features</p>
              </div>
              <Switch
                checked={localSettings.systemUpdates}
                onCheckedChange={(checked) => handleSettingChange("systemUpdates", checked)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Delivery Methods</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications in the app</p>
              </div>
              <Switch
                checked={localSettings.pushNotifications}
                onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                checked={localSettings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button onClick={handleSave} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
