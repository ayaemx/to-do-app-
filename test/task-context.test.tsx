import { renderHook, act } from "@testing-library/react"
import { TaskProvider, useTask } from "@/contexts/task-context"
import type { Task, TaskFormData } from "@/types/task"
import type { ReactNode } from "react"

// Mock local storage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
})

const wrapper = ({ children }: { children: ReactNode }) => <TaskProvider>{children}</TaskProvider>

const sampleTask: Task = {
  id: "1",
  title: "Test Task",
  description: "Test Description",
  status: "todo",
  priority: "medium",
  createdAt: new Date(),
  updatedAt: new Date(),
  folderId: "folder-1",
  pinned: false,
}

describe("TaskContext", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("should throw an error if useTask is used outside of a TaskProvider", () => {
    // Suppress console.error for this test
    const originalError = console.error
    console.error = jest.fn()

    expect(() => renderHook(() => useTask())).toThrow("useTask must be used within a TaskProvider")

    // Restore console.error
    console.error = originalError
  })

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useTask(), { wrapper })

    expect(result.current.tasks).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.filters).toEqual({})
  })

  it("should create a new task", async () => {
    const { result } = renderHook(() => useTask(), { wrapper })

    const taskData: TaskFormData = {
      title: "New Task",
      description: "A new task to be tested",
      status: "todo",
      priority: "high",
      folderId: "folder-1",
    }

    await act(async () => {
      await result.current.createTask(taskData)
    })

    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].title).toBe("New Task")
    expect(result.current.tasks[0].priority).toBe("high")
  })

  it("should update an existing task", async () => {
    const { result } = renderHook(() => useTask(), { wrapper })

    // First, create a task
    await act(async () => {
      await result.current.createTask({
        title: "Original Title",
        status: "todo",
        priority: "low",
        folderId: "folder-1",
      })
    })

    const taskId = result.current.tasks[0].id
    const updatedData: Partial<TaskFormData> = {
      title: "Updated Title",
      status: "in-progress",
    }

    await act(async () => {
      await result.current.updateTask(taskId, updatedData)
    })

    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].title).toBe("Updated Title")
    expect(result.current.tasks[0].status).toBe("in-progress")
  })

  it("should delete a task", async () => {
    const { result } = renderHook(() => useTask(), { wrapper })

    // Create two tasks
    await act(async () => {
      await result.current.createTask({ title: "Task 1", status: "todo", priority: "low", folderId: "folder-1" })
      await result.current.createTask({ title: "Task 2", status: "todo", priority: "low", folderId: "folder-1" })
    })

    expect(result.current.tasks).toHaveLength(2)

    const taskIdToDelete = result.current.tasks[0].id

    await act(async () => {
      await result.current.deleteTask(taskIdToDelete)
    })

    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks.find((task) => task.id === taskIdToDelete)).toBeUndefined()
  })

  it("should set filters and return filtered tasks", async () => {
    const { result } = renderHook(() => useTask(), { wrapper })

    // Create some tasks
    await act(async () => {
      await result.current.createTask({ title: "High Prio Task", status: "todo", priority: "high", folderId: "folder-1" })
      await result.current.createTask({ title: "Low Prio Task", status: "completed", priority: "low", folderId: "folder-1" })
      await result.current.createTask({ title: "Another High Prio", status: "in-progress", priority: "high", folderId: "folder-2" })
    })

    act(() => {
      result.current.setFilters({ priority: "high" })
    })

    let filteredTasks = result.current.getFilteredTasks()
    expect(filteredTasks).toHaveLength(2)
    expect(filteredTasks.every((task) => task.priority === "high")).toBe(true)

    act(() => {
      result.current.setFilters({ status: "completed" })
    })

    filteredTasks = result.current.getFilteredTasks()
    expect(filteredTasks).toHaveLength(1)
    expect(filteredTasks[0].title).toBe("Low Prio Task")

    act(() => {
      result.current.setFilters({ folderId: "folder-2" })
    })

    filteredTasks = result.current.getFilteredTasks()
    expect(filteredTasks).toHaveLength(1)
    expect(filteredTasks[0].title).toBe("Another High Prio")
  })

  it("should return tasks by folder", async () => {
    const { result } = renderHook(() => useTask(), { wrapper })

    await act(async () => {
      await result.current.createTask({ title: "Task A", folderId: "folder-1", status: "todo", priority: "low" })
      await result.current.createTask({ title: "Task B", folderId: "folder-2", status: "todo", priority: "low" })
      await result.current.createTask({ title: "Task C", folderId: "folder-1", status: "todo", priority: "low" })
    })

    const folder1Tasks = result.current.getTasksByFolder("folder-1")
    expect(folder1Tasks).toHaveLength(2)
    expect(folder1Tasks.every((task) => task.folderId === "folder-1")).toBe(true)

    const folder2Tasks = result.current.getTasksByFolder("folder-2")
    expect(folder2Tasks).toHaveLength(1)
    expect(folder2Tasks[0].title).toBe("Task B")
  })

  it("should set an error when updating a non-existent task", async () => {
    const { result } = renderHook(() => useTask(), { wrapper })

    await act(async () => {
      await result.current.updateTask("non-existent-id", { title: "Wont work" })
    })

    expect(result.current.error).toBe("Failed to update task")
  })

  it("should filter tasks by search keyword", async () => {
    const { result } = renderHook(() => useTask(), { wrapper })

    await act(async () => {
      await result.current.createTask({
        title: "React Hooks",
        description: "Learn about useState",
        tags: ["react", "frontend"],
        status: "todo",
        priority: "high",
        folderId: "folder-1",
      })
      await result.current.createTask({
        title: "Node.js Server",
        description: "Build a REST API",
        tags: ["node", "backend"],
        status: "in-progress",
        priority: "high",
        folderId: "folder-1",
      })
    })

    act(() => {
      result.current.setFilters({ search: "rest" })
    })

    let filteredTasks = result.current.getFilteredTasks()
    expect(filteredTasks).toHaveLength(1)
    expect(filteredTasks[0].description).toContain("REST API")

    act(() => {
      result.current.setFilters({ search: "react" })
    })

    filteredTasks = result.current.getFilteredTasks()
    expect(filteredTasks).toHaveLength(1)
    expect(filteredTasks[0].title).toBe("React Hooks")
  })

  it("should handle pinning and unpinning tasks", async () => {
    const { result } = renderHook(() => useTask(), { wrapper })

    await act(async () => {
      await result.current.createTask({
        title: "Task to be pinned",
        status: "todo",
        priority: "medium",
        folderId: "folder-1",
        pinned: false,
      })
    })

    const taskId = result.current.tasks[0].id
    expect(result.current.tasks[0].pinned).toBe(false)

    // Pin the task
    await act(async () => {
      await result.current.updateTask(taskId, { pinned: true })
    })
    expect(result.current.tasks[0].pinned).toBe(true)

    // Unpin the task
    await act(async () => {
      await result.current.updateTask(taskId, { pinned: false })
    })
    expect(result.current.tasks[0].pinned).toBe(false)
  })

  it("should persist tasks to local storage", async () => {
    const { result, unmount } = renderHook(() => useTask(), { wrapper })

    const taskData: TaskFormData = {
      title: "Persistent Task",
      status: "todo",
      priority: "medium",
      folderId: "folder-1",
    }

    await act(async () => {
      await result.current.createTask(taskData)
    })

    expect(localStorage.getItem("coursology-tasks")).not.toBeNull()
    const storedTasks = JSON.parse(localStorage.getItem("coursology-tasks")!)
    expect(storedTasks).toHaveLength(1)
    expect(storedTasks[0].title).toBe("Persistent Task")

    // Unmount and remount to check if tasks are loaded from storage
    unmount()

    const { result: newResult } = renderHook(() => useTask(), { wrapper })
    expect(newResult.current.tasks).toHaveLength(1)
    expect(newResult.current.tasks[0].title).toBe("Persistent Task")
  })
})
