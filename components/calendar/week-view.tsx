"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCalendar } from "@/contexts/calendar-context"
import { format, startOfWeek, eachDayOfInterval, isToday } from "date-fns"

const timeSlots = Array.from({ length: 24 }, (_, i) => i)

export function WeekView() {
  const { currentView, getEventsForDate } = useCalendar()

  const weekStart = startOfWeek(currentView.date)
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000),
  })

  return (
    <Card className="p-4 rounded-xl shadow-lg bg-card">
      <div className="relative">
        <div className="grid grid-cols-[auto_1fr] gap-1 mb-4">
          <div className="p-2 w-16"></div>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 gap-2 min-w-[600px]">
              {weekDays.map(day => {
                const dayEvents = getEventsForDate(day)
                const isDayToday = isToday(day)

                return (
                  <div
                    key={day.toISOString()}
                    className={`p-3 text-center rounded-xl transition-all duration-300 ${
                      isDayToday
                        ? "bg-primary/10 border-2 border-primary/30 shadow-md"
                        : "bg-muted/50 border border-border/50"
                    }`}
                  >
                    <div
                      className={`font-semibold text-sm ${
                        isDayToday ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {format(day, "EEE")}
                    </div>
                    <div
                      className={`text-2xl font-bold mt-1 ${
                        isDayToday ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {format(day, "d")}
                    </div>
                    {dayEvents.length > 0 && (
                      <Badge
                        variant={isDayToday ? "primary" : "secondary"}
                        className="text-xs mt-2 px-2 py-1"
                      >
                        {dayEvents.length} event{dayEvents.length > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="grid grid-cols-[auto_1fr] gap-1">
          {/* Time column */}
          <div className="space-y-1 w-16">
            {timeSlots.map(hour => (
              <div
                key={hour}
                className="h-20 p-2 text-xs text-muted-foreground text-right flex items-start justify-end pt-1"
              >
                <span className="relative -top-1.5">
                  {hour === 0
                    ? "12 AM"
                    : hour < 12
                    ? `${hour} AM`
                    : hour === 12
                    ? "12 PM"
                    : `${hour - 12} PM`}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 gap-2 min-w-[600px]">
              {weekDays.map(day => {
                const dayEvents = getEventsForDate(day)

                return (
                  <div key={day.toISOString()} className="space-y-1">
                    {timeSlots.map(hour => (
                      <div
                        key={hour}
                        className="h-20 border border-border/30 rounded-lg p-1 hover:bg-muted/50 transition-colors relative"
                      >
                        {dayEvents
                          .filter(event => {
                            const eventDate = new Date(event.startDate)
                            return eventDate.getHours() === hour
                          })
                          .map(event => (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xs p-2 rounded-md mb-1 truncate cursor-pointer hover:shadow-lg transition-shadow"
                              style={{
                                backgroundColor: `${event.color}30`,
                                color: event.color,
                                borderLeft: `4px solid ${event.color}`,
                              }}
                              title={`${event.title} - ${
                                event.description || "No description"
                              }`}
                            >
                              <p className="font-semibold">{event.title}</p>
                            </motion.div>
                          ))}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </Card>
  )
}
