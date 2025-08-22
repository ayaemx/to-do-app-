"use client"

import type React from "react"
import { createContext, useContext, useReducer, useCallback } from "react"
import type { CalendarEvent, CalendarView, CalendarFilters } from "@/types/calendar"
import { useTask } from "@/contexts/task-context"
import { useFolder } from "@/contexts/folder-context"

interface CalendarState {
  events: CalendarEvent[]
  currentView: CalendarView
  filters: CalendarFilters
  loading: boolean
  error: string | null
}

type CalendarAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_EVENTS"; payload: CalendarEvent[] }
  | { type: "ADD_EVENT"; payload: CalendarEvent }
  | { type: "UPDATE_EVENT"; payload: CalendarEvent }
  | { type: "DELETE_EVENT"; payload: string }
  | { type: "SET_VIEW"; payload: CalendarView }
  | { type: "SET_FILTERS"; payload: CalendarFilters }

const initialState: CalendarState = {
  events: [],
  currentView: { type: "month", date: new Date() },
  filters: {
    showCompleted: false,
  },
  loading: false,
  error: null,
}

const calendarReducer = (state: CalendarState, action: CalendarAction): CalendarState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }
    case "SET_EVENTS":
      return { ...state, events: action.payload, loading: false, error: null }
    case "ADD_EVENT":
      return { ...state, events: [...state.events, action.payload], loading: false, error: null }
    case "UPDATE_EVENT":
      return {
        ...state,
        events: state.events.map((event) => (event.id === action.payload.id ? action.payload : event)),
        loading: false,
        error: null,
      }
    case "DELETE_EVENT":
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload),
        loading: false,
        error: null,
      }
    case "SET_VIEW":
      return { ...state, currentView: action.payload }
    case "SET_FILTERS":
      return { ...state, filters: action.payload }
    default:
      return state
  }
}

interface CalendarContextType extends CalendarState {
  setView: (view: CalendarView) => void
  setFilters: (filters: CalendarFilters) => void
  getEventsForDate: (date: Date) => CalendarEvent[]
  getEventsForDateRange: (startDate: Date, endDate: Date) => CalendarEvent[]
  navigateToDate: (date: Date) => void
  navigateNext: () => void
  navigatePrevious: () => void
  syncWithTasks: () => void
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined)

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(calendarReducer, initialState)
  const { getFilteredTasks } = useTask()
  const { getFolderById } = useFolder()

  const syncWithTasks = useCallback(() => {
    const tasks = getFilteredTasks()
    const events: CalendarEvent[] = tasks
      .filter((task) => task.dueDate)
      .map((task) => {
        const folder = task.folderId ? getFolderById(task.folderId) : null
        return {
          id: `task-${task.id}`,
          taskId: task.id,
          title: task.title,
          description: task.description,
          startDate: new Date(task.dueDate!),
          allDay: true,
          color: folder?.color || getPriorityColor(task.priority),
          priority: task.priority,
          status: task.status,
          folderId: task.folderId,
        }
      })

    dispatch({ type: "SET_EVENTS", payload: events })
  }, [getFilteredTasks, getFolderById])

  const setView = useCallback((view: CalendarView) => {
    dispatch({ type: "SET_VIEW", payload: view })
  }, [])

  const setFilters = useCallback((filters: CalendarFilters) => {
    dispatch({ type: "SET_FILTERS", payload: filters })
  }, [])

  const getEventsForDate = useCallback(
    (date: Date) => {
      const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      return state.events.filter((event) => {
        const eventDate = new Date(event.startDate.getFullYear(), event.startDate.getMonth(), event.startDate.getDate())
        return eventDate.getTime() === targetDate.getTime() && shouldShowEvent(event, state.filters)
      })
    },
    [state.events, state.filters],
  )

  const getEventsForDateRange = useCallback(
    (startDate: Date, endDate: Date) => {
      return state.events.filter((event) => {
        const eventDate = event.startDate
        return eventDate >= startDate && eventDate <= endDate && shouldShowEvent(event, state.filters)
      })
    },
    [state.events, state.filters],
  )

  const navigateToDate = useCallback(
    (date: Date) => {
      dispatch({ type: "SET_VIEW", payload: { ...state.currentView, date } })
    },
    [state.currentView],
  )

  const navigateNext = useCallback(() => {
    const currentDate = state.currentView.date
    let nextDate: Date

    if (state.currentView.type === "month") {
      nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    } else {
      nextDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)
    }

    dispatch({ type: "SET_VIEW", payload: { ...state.currentView, date: nextDate } })
  }, [state.currentView])

  const navigatePrevious = useCallback(() => {
    const currentDate = state.currentView.date
    let prevDate: Date

    if (state.currentView.type === "month") {
      prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    } else {
      prevDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    dispatch({ type: "SET_VIEW", payload: { ...state.currentView, date: prevDate } })
  }, [state.currentView])

  const value: CalendarContextType = {
    ...state,
    setView,
    setFilters,
    getEventsForDate,
    getEventsForDateRange,
    navigateToDate,
    navigateNext,
    navigatePrevious,
    syncWithTasks,
  }

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>
}

export function useCalendar() {
  const context = useContext(CalendarContext)
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider")
  }
  return context
}

// Helper functions
function getPriorityColor(priority: string): string {
  switch (priority) {
    case "urgent":
      return "#ef4444"
    case "high":
      return "#f97316"
    case "medium":
      return "#eab308"
    case "low":
      return "#22c55e"
    default:
      return "#6b7280"
  }
}

function shouldShowEvent(event: CalendarEvent, filters: CalendarFilters): boolean {
  if (!filters.showCompleted && event.status === "completed") {
    return false
  }

  if (filters.folderId && event.folderId !== filters.folderId) {
    return false
  }

  if (filters.priority && event.priority !== filters.priority) {
    return false
  }

  if (filters.status && event.status !== filters.status) {
    return false
  }

  return true
}
