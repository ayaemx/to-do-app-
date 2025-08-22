"use client"

import { motion } from "framer-motion"
import { CheckCircle, Circle, XCircle, Clock } from "lucide-react"
import type { Task } from "@/types/task"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface UpcomingTaskItemProps {
  task: Task
  index: number
}

const getStatusIcon = (task: Task) => {
  if (task.status === "completed") {
    return (
      <div className="rounded-full bg-green-100 p-1.5">
        <CheckCircle className="h-4 w-4 text-green-600" />
      </div>
    );
  }
  if (task.dueDate && new Date(task.dueDate) < new Date()) {
    return (
      <div className="rounded-full bg-red-100 p-1.5">
        <XCircle className="h-4 w-4 text-red-600" />
      </div>
    );
  }
  return (
    <div className="rounded-full bg-yellow-100 p-1.5">
      <Circle className="h-4 w-4 text-yellow-600" />
    </div>
  );
};

const getPriorityBadge = (priority: Task['priority']) => {
  if (!priority) return null;
  const priorityClasses = {
    low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
    urgent: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
  }
  return <Badge variant="outline" className={`text-xs ${priorityClasses[priority]}`}>{priority}</Badge>
}


export function UpcomingTaskItem({ task, index }: UpcomingTaskItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>{getStatusIcon(task)}</div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{task.title}</p>
              {task.dueDate && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <Clock className="h-3 w-3" />
                  <span>Due: {format(new Date(task.dueDate), "p")}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getPriorityBadge(task.priority)}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
