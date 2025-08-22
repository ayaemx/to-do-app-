export interface Notification {
  id: string
  type: "task-due" | "task-overdue" | "achievement" | "system" | "blog" | "reminder"
  title: string
  message: string
  read: boolean
  createdAt: Date
  actionUrl?: string
  metadata?: {
    taskId?: string
    blogId?: string
    priority?: "low" | "medium" | "high" | "urgent"
  }
}

export interface NotificationSettings {
  taskReminders: boolean
  overdueAlerts: boolean
  achievementNotifications: boolean
  blogUpdates: boolean
  systemUpdates: boolean
  emailNotifications: boolean
  pushNotifications: boolean
  reminderTime: number // hours before due date
}

export interface ToastNotification {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}
