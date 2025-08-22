"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useCalendar } from "@/contexts/calendar-context"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from "date-fns"

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function MonthView() {
  const { currentView, getEventsForDate } = useCalendar()

  const monthStart = startOfMonth(currentView.date)
  const monthEnd = endOfMonth(currentView.date)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  return (
    <Card className="p-4">
      <div className="grid grid-cols-7 gap-1 mb-4">
        {weekDays.map((day) => (
          <div key={day} className="p-2 text-center font-semibold text-sm text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day)
          const isCurrentMonth = isSameMonth(day, currentView.date)
          const isDayToday = isToday(day)

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.01 }}
              className={`min-h-[120px] p-2 border rounded-lg transition-colors hover:bg-muted/50 ${
                !isCurrentMonth ? "opacity-40" : ""
              } ${isDayToday ? "bg-primary/5 border-primary/20" : "border-border"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm font-medium ${
                    isDayToday ? "text-primary font-bold" : isCurrentMonth ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {format(day, "d")}
                </span>
                {dayEvents.length > 0 && (
                  <Badge variant="secondary" className="text-xs h-5">
                    {dayEvents.length}
                  </Badge>
                )}
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs p-1 rounded truncate"
                    style={{
                      backgroundColor: `${event.color}20`,
                      color: event.color,
                      borderLeft: `3px solid ${event.color}`,
                    }}
                    title={event.title}
                  >
                    {event.title}
                  </motion.div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center">+{dayEvents.length - 3} more</div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </Card>
  )
}
