export interface CalendarEvent {
  id: string
  taskId: string
  title: string
  description?: string
  startDate: Date
  endDate?: Date
  allDay: boolean
  color: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "todo" | "in-progress" | "completed" | "pending" 
  folderId?: string
}
export interface CalendarView {
  type: "month" | "week"
  date: Date
}

export interface CalendarFilters {
  folderId?: string
  priority?: string
  status?: string
  showCompleted: boolean
}

export interface WeekDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  events: CalendarEvent[]
}

export interface CalendarMonth {
  year: number
  month: number
  weeks: WeekDay[][]
}
