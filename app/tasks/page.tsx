"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { TaskList } from "@/components/tasks/task-list"
import { useTask } from "@/contexts/task-context"

export default function TasksPage() {
  const searchParams = useSearchParams()
  const { setFilters } = useTask()

  useEffect(() => {
    const folderId = searchParams.get("folder")
    if (folderId) {
      setFilters({ folderId })
    } else {
      setFilters({})
    }
  }, [searchParams, setFilters])

  return <TaskList />
}
