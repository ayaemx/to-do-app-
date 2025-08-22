"use client"

import { Filter, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useCalendar } from "@/contexts/calendar-context"
import { useFolder } from "@/contexts/folder-context"

export function CalendarFilters() {
  const { filters, setFilters } = useCalendar()
  const { folders } = useFolder()

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    setFilters({ showCompleted: false })
  }

  return (
    <Card className="mb-6 rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 font-semibold">
          <Filter className="h-5 w-5" />
          Calendar Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Folder</Label>
            <Select
              value={filters.folderId || "all"}
              onValueChange={(value) => handleFilterChange("folderId", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Folders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Folders</SelectItem>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: folder.color }} />
                      {folder.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={filters.priority || "all"}
              onValueChange={(value) => handleFilterChange("priority", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => handleFilterChange("status", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col justify-between">
            <div className="flex items-center space-x-2 mb-4">
              <Switch
                id="show-completed"
                checked={filters.showCompleted}
                onCheckedChange={(checked) => handleFilterChange("showCompleted", checked)}
              />
              <Label htmlFor="show-completed" className="flex items-center gap-2">
                {filters.showCompleted ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                Show Completed
              </Label>
            </div>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
