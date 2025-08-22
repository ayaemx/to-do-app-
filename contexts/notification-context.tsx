"use client"

import type React from "react"
import { createContext, useContext, useReducer, useCallback, useEffect } from "react"
import type { Notification, NotificationSettings, ToastNotification } from "@/types/notification"
import { useTask } from "@/contexts/task-context"

interface NotificationState {
  notifications: Notification[]
  toasts: ToastNotification[]
  settings: NotificationSettings
  unreadCount: number
  loading: boolean
  error: string | null
}

type NotificationAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_NOTIFICATIONS"; payload: Notification[] }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "MARK_AS_READ"; payload: string }
  | { type: "MARK_ALL_AS_READ" }
  | { type: "DELETE_NOTIFICATION"; payload: string }
  | { type: "UPDATE_SETTINGS"; payload: Partial<NotificationSettings> }
  | { type: "ADD_TOAST"; payload: ToastNotification }
  | { type: "REMOVE_TOAST"; payload: string }

const defaultSettings: NotificationSettings = {
  taskReminders: true,
  overdueAlerts: true,
  achievementNotifications: true,
  blogUpdates: true,
  systemUpdates: true,
  emailNotifications: false,
  pushNotifications: true,
  reminderTime: 24, // 24 hours before due date
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "task-due",
    title: "Task Due Tomorrow",
    message: "Your task 'Complete Medical Board Preparation' is due tomorrow",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    metadata: { taskId: "task-1", priority: "high" },
  },
  {
    id: "2",
    type: "achievement",
    title: "Congratulations!",
    message: "You've completed 10 tasks this week. Keep up the great work!",
    read: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    id: "3",
    type: "blog",
    title: "New Medical News",
    message: "A new article about medical test innovations has been published",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    actionUrl: "/blog",
  },
  {
    id: "4",
    type: "task-overdue",
    title: "Overdue Task",
    message: "Your task 'Review Anatomy Notes' is now overdue",
    read: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    metadata: { taskId: "task-2", priority: "urgent" },
  },
  {
    id: "5",
    type: "system",
    title: "System Update",
    message: "New features have been added to the calendar view",
    read: true,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
  },
]

const initialState: NotificationState = {
  notifications: initialNotifications,
  toasts: [],
  settings: defaultSettings,
  unreadCount: initialNotifications.filter((n) => !n.read).length,
  loading: false,
  error: null,
}

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }
    case "SET_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter((n) => !n.read).length,
        loading: false,
        error: null,
      }
    case "ADD_NOTIFICATION":
      const newNotifications = [action.payload, ...state.notifications]
      return {
        ...state,
        notifications: newNotifications,
        unreadCount: newNotifications.filter((n) => !n.read).length,
      }
    case "MARK_AS_READ":
      const updatedNotifications = state.notifications.map((notification) =>
        notification.id === action.payload ? { ...notification, read: true } : notification,
      )
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter((n) => !n.read).length,
      }
    case "MARK_ALL_AS_READ":
      const allReadNotifications = state.notifications.map((notification) => ({ ...notification, read: true }))
      return {
        ...state,
        notifications: allReadNotifications,
        unreadCount: 0,
      }
    case "DELETE_NOTIFICATION":
      const filteredNotifications = state.notifications.filter((notification) => notification.id !== action.payload)
      return {
        ...state,
        notifications: filteredNotifications,
        unreadCount: filteredNotifications.filter((n) => !n.read).length,
      }
    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      }
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      }
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload),
      }
    default:
      return state
  }
}

interface NotificationContextType extends NotificationState {
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  updateSettings: (settings: Partial<NotificationSettings>) => void
  showToast: (toast: Omit<ToastNotification, "id">) => void
  dismissToast: (id: string) => void
  checkTaskNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState)
  const { getFilteredTasks } = useTask()

  const markAsRead = useCallback((id: string) => {
    dispatch({ type: "MARK_AS_READ", payload: id })
  }, [])

  const markAllAsRead = useCallback(() => {
    dispatch({ type: "MARK_ALL_AS_READ" })
  }, [])

  const deleteNotification = useCallback((id: string) => {
    dispatch({ type: "DELETE_NOTIFICATION", payload: id })
  }, [])

  const updateSettings = useCallback((settings: Partial<NotificationSettings>) => {
    dispatch({ type: "UPDATE_SETTINGS", payload: settings })
  }, [])

  const showToast = useCallback((toast: Omit<ToastNotification, "id">) => {
    const id = Date.now().toString()
    const newToast: ToastNotification = {
      ...toast,
      id,
      duration: toast.duration || 5000,
    }
    dispatch({ type: "ADD_TOAST", payload: newToast })

    // Auto-dismiss toast
    setTimeout(() => {
      dispatch({ type: "REMOVE_TOAST", payload: id })
    }, newToast.duration)
  }, [])

  const dismissToast = useCallback((id: string) => {
    dispatch({ type: "REMOVE_TOAST", payload: id })
  }, [])

  const checkTaskNotifications = useCallback(() => {
    if (!state.settings.taskReminders && !state.settings.overdueAlerts) return

    const tasks = getFilteredTasks()
    const now = new Date()
    const reminderThreshold = state.settings.reminderTime * 60 * 60 * 1000 // Convert hours to milliseconds

    tasks.forEach((task) => {
      if (!task.dueDate) return

      const dueDate = new Date(task.dueDate)
      const timeDiff = dueDate.getTime() - now.getTime()

      // Check for overdue tasks
      if (state.settings.overdueAlerts && timeDiff < 0 && task.status !== "completed") {
        const existingOverdueNotification = state.notifications.find(
          (n) => n.type === "task-overdue" && n.metadata?.taskId === task.id,
        )

        if (!existingOverdueNotification) {
          const notification: Notification = {
            id: `overdue-${task.id}-${Date.now()}`,
            type: "task-overdue",
            title: "Task Overdue",
            message: `Your task "${task.title}" is now overdue`,
            read: false,
            createdAt: new Date(),
            metadata: { taskId: task.id, priority: task.priority },
          }
          dispatch({ type: "ADD_NOTIFICATION", payload: notification })
        }
      }

      // Check for upcoming due tasks
      if (
        state.settings.taskReminders &&
        timeDiff > 0 &&
        timeDiff <= reminderThreshold &&
        task.status !== "completed"
      ) {
        const existingReminderNotification = state.notifications.find(
          (n) => n.type === "task-due" && n.metadata?.taskId === task.id,
        )

        if (!existingReminderNotification) {
          const hoursUntilDue = Math.ceil(timeDiff / (60 * 60 * 1000))
          const notification: Notification = {
            id: `due-${task.id}-${Date.now()}`,
            type: "task-due",
            title: "Task Due Soon",
            message: `Your task "${task.title}" is due in ${hoursUntilDue} hour${hoursUntilDue !== 1 ? "s" : ""}`,
            read: false,
            createdAt: new Date(),
            metadata: { taskId: task.id, priority: task.priority },
          }
          dispatch({ type: "ADD_NOTIFICATION", payload: notification })
        }
      }
    })
  }, [getFilteredTasks, state.settings, state.notifications])

  // Check for task notifications periodically
  useEffect(() => {
    checkTaskNotifications()
    const interval = setInterval(checkTaskNotifications, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [checkTaskNotifications])

  const value: NotificationContextType = {
    ...state,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateSettings,
    showToast,
    dismissToast,
    checkTaskNotifications,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}
