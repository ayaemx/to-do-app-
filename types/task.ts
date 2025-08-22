export interface Task {
  id: string
  title: string
  description?: string
  status: "todo" | "in-progress" | "completed" | "pending"
  priority: "low" | "medium" | "high" | "urgent"
  dueDate?: Date
  folderId?: string
  createdAt: Date
  updatedAt: Date
  tags?: string[]
  pinned?: boolean
}

export interface TaskFormData {
  title: string
  description?: string
  status: Task["status"]
  priority: Task["priority"]
  dueDate?: Date
  folderId?: string
  tags?: string[]
  pinned?: boolean
}

export interface TaskFilters {
  status?: Task["status"]
  priority?: Task["priority"]
  folderId?: string
  search?: string
}
