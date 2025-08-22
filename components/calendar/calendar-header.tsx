"use client"

import { ChevronLeft, ChevronRight, CalendarIcon, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useCalendar } from "@/contexts/calendar-context"
import { format } from "date-fns"

export function CalendarHeader() {
  const { currentView, setView, navigateNext, navigatePrevious, navigateToDate, events } = useCalendar()

  const handleViewChange = (viewType: "month" | "week") => {
  setView({ ...currentView, type: viewType })
}

  const goToToday = () => {
    navigateToDate(new Date())
  }

  const getHeaderTitle = () => {
    if (currentView.type === "month") {
      return format(currentView.date, "MMMM yyyy")
    } else {
      const startOfWeek = new Date(currentView.date)
      startOfWeek.setDate(currentView.date.getDate() - currentView.date.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return format(startOfWeek, "MMMM yyyy")
      } else {
        return `${format(startOfWeek, "MMM")} - ${format(endOfWeek, "MMM yyyy")}`
      }
    }
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-card rounded-xl shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={navigatePrevious} className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={navigateNext} className="rounded-full">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">{getHeaderTitle()}</h1>
          <Badge variant="secondary" className="text-sm font-semibold">
            {events.length} event{events.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Select value={currentView.type} onValueChange={handleViewChange}>
          <SelectTrigger className="w-36 h-10 rounded-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">
              <div className="flex items-center gap-2">
                <Grid className="h-4 w-4" />
                <span>Month</span>
              </div>
            </SelectItem>
            <SelectItem value="week">
              <div className="flex items-center gap-2">
                <List className="h-4 w-4" />
                <span>Week</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
