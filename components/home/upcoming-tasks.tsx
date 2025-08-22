"use client"

import { useRouter } from "next/navigation"
import { useTask } from "@/contexts/task-context"
import { UpcomingTaskItem } from "./upcoming-task-item"
import { Button } from "@/components/ui/button"
import { CheckSquare, ArrowRight } from "lucide-react"
import type { Task } from "@/types/task"

export function UpcomingTasks() {
  const { tasks } = useTask()
  const router = useRouter()

  const upcomingTasks = tasks
    .filter((task: Task) => task.status !== "completed")
    .slice(0, 4)

  return (
    <div>
      <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
        <CheckSquare className="text-blue-500" />
        Upcoming Tasks
      </h2>
      <div className="space-y-2">
        {upcomingTasks.map((task: Task, index: number) => (
          <UpcomingTaskItem key={task.id} task={task} index={index} />
        ))}
      </div>
      <div className="flex justify-start mt-4">
        <Button
          variant="link"
          className="text-blue-600 hover:text-blue-800"
          onClick={() => router.push("/tasks")}
        >
          View All Tasks
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
