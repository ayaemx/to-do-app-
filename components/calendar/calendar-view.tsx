"use client"

import { useEffect } from "react"
import { CalendarHeader } from "./calendar-header"
import { CalendarFilters } from "./calendar-filters"
import { MonthView } from "./month-view"
import { WeekView } from "./week-view"
import { useCalendar } from "@/contexts/calendar-context"
import { format, isToday } from "date-fns"


export function CalendarView() {
  const { currentView, syncWithTasks, getEventsForDate } = useCalendar()

  useEffect(() => {
    syncWithTasks()
  }, [syncWithTasks])

  // Get today's events
  const today = new Date()
  const todayEvents = getEventsForDate(today)

  return (
    <div className="space-y-6">
      <CalendarHeader />
      <CalendarFilters />
{/* Today Preview (always for the real today) */}
      <div className="bg-card border rounded-xl p-4 mb-2 shadow-sm">
        <div className="font-semibold mb-3 text-primary text-lg">
          Today: {format(today, "EEEE, MMM d")}
        </div>
        {todayEvents.length === 0 ? (
          <div className="text-muted-foreground text-sm">No events for today.</div>
        ) : (
          <ul className="space-y-2">
            {todayEvents.map(event => (
              <li key={event.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ background: event.color }}
                />
                <span className="text-sm font-medium">{event.title}</span>
                {event.startDate && (
                  <span className="text-xs text-muted-foreground ml-auto">
                    {format(new Date(event.startDate), "p")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {currentView.type === "month" ? <MonthView /> : <WeekView />}
    </div>
  )
}
