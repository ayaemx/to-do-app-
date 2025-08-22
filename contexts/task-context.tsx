"use client"

import type React from "react"
import { createContext, useContext, useReducer, useCallback, useEffect } from "react"
import type { Task, TaskFormData, TaskFilters } from "@/types/task"

interface TaskState {
  tasks: Task[]
  loading: boolean
  error: string | null
  filters: TaskFilters
}

type TaskAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "SET_FILTERS"; payload: TaskFilters }

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  filters: {},
}

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }
    case "SET_TASKS":
      return { ...state, tasks: action.payload, loading: false, error: null }
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload], loading: false, error: null }
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.payload.id ? action.payload : task)),
        loading: false,
        error: null,
      }
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        loading: false,
        error: null,
      }
    case "SET_FILTERS":
      return { ...state, filters: action.payload }
    default:
      return state
  }
}

interface TaskContextType extends TaskState {
  createTask: (taskData: TaskFormData) => Promise<void>
  updateTask: (id: string, taskData: Partial<TaskFormData>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  setFilters: (filters: TaskFilters) => void
  getFilteredTasks: () => Task[]
  getTasksByFolder: (folderId: string) => Task[]
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const STORAGE_KEY = "coursology-tasks"

const loadTasksFromStorage = (): Task[] => {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      // Sanitize the stored string to remove invalid characters
      const sanitizedStored = stored.replace(/[^\x20-\x7E]/g, "")
      const tasks = JSON.parse(sanitizedStored)
      return tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        pinned: !!task.pinned,
      }))
    }
  } catch (error) {
    console.error("Failed to load tasks from storage:", error)
  }
  return []
}

const saveTasksToStorage = (tasks: Task[]) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch (error) {
    console.error("Failed to save tasks to storage:", error)
  }
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  useEffect(() => {
    const savedTasks = loadTasksFromStorage()
    if (savedTasks.length > 0) {
      dispatch({ type: "SET_TASKS", payload: savedTasks })
    }
  }, [])

  useEffect(() => {
    if (state.tasks.length > 0) {
      saveTasksToStorage(state.tasks)
    }
  }, [state.tasks])

  const createTask = useCallback(async (taskData: TaskFormData) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      await new Promise((resolve) => setTimeout(resolve, 50))

      const newTask: Task = {
        id: Date.now().toString(),
        ...taskData,
        createdAt: new Date(),
        updatedAt: new Date(),
        pinned: !!taskData.pinned,
      }

      dispatch({ type: "ADD_TASK", payload: newTask })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to create task" })
    }
  }, [])

  const updateTask = useCallback(
    async (id: string, taskData: Partial<TaskFormData>) => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        await new Promise((resolve) => setTimeout(resolve, 50))

        const existingTask = state.tasks.find((task) => task.id === id)
        if (!existingTask) {
          throw new Error("Task not found")
        }

        const updatedTask: Task = {
          ...existingTask,
          ...taskData,
          updatedAt: new Date(),
          pinned: typeof taskData.pinned === "boolean" ? taskData.pinned : existingTask.pinned,
        }

        dispatch({ type: "UPDATE_TASK", payload: updatedTask })
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to update task" })
      }
    },
    [state.tasks],
  )

  const deleteTask = useCallback(async (id: string) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      await new Promise((resolve) => setTimeout(resolve, 50))

      dispatch({ type: "DELETE_TASK", payload: id })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to delete task" })
    }
  }, [])

  const setFilters = useCallback((filters: TaskFilters) => {
    dispatch({ type: "SET_FILTERS", payload: filters })
  }, [])

  const getFilteredTasks = useCallback(() => {
    let filtered = state.tasks

    if (state.filters.status) {
      filtered = filtered.filter((task) => task.status === state.filters.status)
    }

    if (state.filters.priority) {
      filtered = filtered.filter((task) => task.priority === state.filters.priority)
    }

    if (state.filters.folderId) {
      filtered = filtered.filter((task) => task.folderId === state.filters.folderId)
    }

    if (state.filters.search) {
      const search = state.filters.search.toLowerCase()
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(search) ||
          task.description?.toLowerCase().includes(search) ||
          task.tags?.some((tag) => tag.toLowerCase().includes(search)),
      )
    }

    return filtered
  }, [state.tasks, state.filters])

  const getTasksByFolder = useCallback(
    (folderId: string) => {
      return state.tasks.filter((task) => task.folderId === folderId)
    },
    [state.tasks],
  )

  const value: TaskContextType = {
    ...state,
    createTask,
    updateTask,
    deleteTask,
    setFilters,
    getFilteredTasks,
    getTasksByFolder,
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export function useTask() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider")
  }
  return context
}
