"use client"

import { useSearchParams } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { TaskCard } from "./task-card"
import { TaskForm } from "./task-form"
import { useTask } from "@/contexts/task-context"
import type { Task } from "@/types/task"
import { useMemo, useState, useCallback, useEffect } from "react"


const STATUS_ORDER = ["todo", "in-progress", "completed", "pending"] as const
const STATUS_LABELS: Record<Task["status"], string> = {
  "todo": "To Do",
  "in-progress": "In Progress",
  "completed": "Completed",
   "pending": "Pending",
}

interface TaskListProps {
  folderId?: string
}

export function TaskList({ folderId }: TaskListProps) {
  const { getFilteredTasks, updateTask, loading, error, filters, setFilters } = useTask()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const taskId = searchParams.get("taskId")
    if (taskId) {
      setHighlightedTaskId(taskId)
      const timer = setTimeout(() => {
        setHighlightedTaskId(null)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  // Drag state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [dragOverStatus, setDragOverStatus] = useState<Task["status"] | null>(null)

 const tasks = useMemo(() => {
    const allTasks = getFilteredTasks()
    if (folderId) {
      return allTasks.filter((task) => task.folderId === folderId)
    }
    return allTasks
  }, [getFilteredTasks, folderId])

const groupedTasks = useMemo(() => {
    const groups: Record<Task["status"], Task[]> = {
      "todo": [],
      "in-progress": [],
      "completed": [],
      "pending": [],
    }
    tasks.forEach((task) => {
      groups[task.status].push(task)
    })
    return groups
  }, [tasks])

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }, [])

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false)
    setEditingTask(undefined)
  }, [])

  // Drag handlers
  const handleDragStart = (taskId: string) => setDraggedTaskId(taskId)
  const handleDragEnd = () => {
    setDraggedTaskId(null)
    setDragOverStatus(null)
  }
  const handleDragEnter = (status: Task["status"]) => setDragOverStatus(status)
  const handleDragLeave = () => setDragOverStatus(null)
  const handleDrop = async (status: Task["status"]) => {
    if (draggedTaskId) {
      await updateTask(draggedTaskId, { status })
      setDraggedTaskId(null)
      setDragOverStatus(null)
    }
  }

  if (error) {
    return (
      <Card className="m-4">
        <CardContent className="pt-6">
          <div className="text-center text-red-600 dark:text-red-400">
            <p>Error: {error}</p>
            <Button variant="outline" onClick={() => window.location.reload()} className="mt-2">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or tag..."
              className="pl-9"
              value={filters.search || ""}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* Grouped by Status with Advanced Drag & Drop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATUS_ORDER.map((status) => (
          <motion.div
            key={status}
            className={`bg-muted/50 rounded-lg p-4 min-h-[300px] flex flex-col transition-all duration-200 border-2
              ${dragOverStatus === status ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-transparent"}
            `}
            onDragOver={e => {
              e.preventDefault()
              handleDragEnter(status)
            }}
            onDragEnter={e => {
              e.preventDefault()
              handleDragEnter(status)
            }}
            onDragLeave={handleDragLeave}
            onDrop={() => handleDrop(status)}
            animate={{ scale: dragOverStatus === status ? 1.03 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {STATUS_LABELS[status]}
              {dragOverStatus === status && (
                <span className="ml-2 text-xs text-blue-600 dark:text-blue-400 animate-pulse">Drop here</span>
              )}
            </h2>
            <div className="flex-1 space-y-4">
              <AnimatePresence>
                {groupedTasks[status].map((task) => (
                  <motion.div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    onDragEnd={handleDragEnd}
                    className={draggedTaskId === task.id ? "opacity-50 scale-95" : ""}
                    whileDrag={{ scale: 0.95, opacity: 0.5 }}
                  >
                    <TaskCard
                      task={task}
                      onEdit={handleEditTask}
                      isHighlighted={highlightedTaskId === task.id}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Task Form Modal */}
      <TaskForm isOpen={isFormOpen} onClose={handleCloseForm} task={editingTask} />
    </div>
  )
}
