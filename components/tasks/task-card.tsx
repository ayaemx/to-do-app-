"use client"

import { useState, memo, useCallback } from "react"
import { motion } from "framer-motion"
import { Calendar, Flag, MoreHorizontal, Edit, Trash2, Pin, PinOff } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Task } from "@/types/task"
import { useTask } from "@/contexts/task-context"
import { format } from "date-fns"

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  isHighlighted?: boolean
}

const priorityColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const statusColors = {
  todo: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  pending: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
}

const TaskCard = memo(function TaskCard({ task, onEdit, isHighlighted }: TaskCardProps) {
  const { updateTask, deleteTask, loading } = useTask()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleStatusChange = useCallback(async (checked: boolean) => {
    const newStatus = checked ? "completed" : "todo"
    await updateTask(task.id, { status: newStatus })
  }, [task.id, updateTask])

  const handleDelete = useCallback(async () => {
    setIsDeleting(true)
    await deleteTask(task.id)
  }, [deleteTask])

  const handlePinToggle = useCallback(async () => {
    await updateTask(task.id, { pinned: !task.pinned })
  }, [task.id, task.pinned, updateTask])

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`hover:shadow-md transition-shadow ${isOverdue ? "border-red-200 dark:border-red-800" : ""} ${
          isHighlighted ? "ring-2 ring-blue-500 shadow-lg" : ""
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              <Checkbox
                checked={task.status === "completed"}
                onCheckedChange={handleStatusChange}
                disabled={loading}
                className="mt-1 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-semibold text-sm break-words ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2 break-words">{task.description}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex-shrink-0"
                onClick={handlePinToggle}
                title={task.pinned ? "Unpin" : "Pin"}
              >
{task.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4 text-yellow-500" />}              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(task)
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete()
                    }}
                    disabled={isDeleting}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2 flex-wrap gap-1">
              <Badge className={priorityColors[task.priority]} variant="secondary">
                <Flag className="mr-1 h-3 w-3" />
                {task.priority}
              </Badge>
              <Badge className={statusColors[task.status]} variant="secondary">
                {task.status}
              </Badge>
            </div>
            {task.dueDate && (
              <div
                className={`flex items-center text-xs flex-shrink-0 ${isOverdue ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}
              >
                <Calendar className="mr-1 h-3 w-3" />
                {format(new Date(task.dueDate), "MMM dd")}
              </div>
            )}
          </div>
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {task.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
})

TaskCard.displayName = 'TaskCard'

export { TaskCard }
