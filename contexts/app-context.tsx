"use client"

import type React from "react"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import { useTask } from "./task-context"
import { useFolder } from "./folder-context"

interface AppContextType {
  refreshFolderTaskCounts: () => void
  isIntroPlaying: boolean
  setIntroPlaying: (isPlaying: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { tasks } = useTask()
  const { folders, updateTaskCount } = useFolder()
  const isUpdatingRef = useRef(false)
  const [isIntroPlaying, setIntroPlaying] = useState(true)

  useEffect(() => {
    const hasIntroPlayed = sessionStorage.getItem("introPlayed")
    if (hasIntroPlayed) {
      setIntroPlaying(false)
    } else {
      setTimeout(() => {
        setIntroPlaying(false)
        sessionStorage.setItem("introPlayed", "true")
      }, 4000)
    }
  }, [])

  const refreshFolderTaskCounts = () => {
    if (isUpdatingRef.current) return
    
    isUpdatingRef.current = true
    try {
      folders.forEach((folder) => {
        const taskCount = tasks.filter((task) => task.folderId === folder.id).length
        if (folder.taskCount !== taskCount) {
          updateTaskCount(folder.id, taskCount)
        }
      })
    } finally {
      isUpdatingRef.current = false
    }
  }

  useEffect(() => {
    refreshFolderTaskCounts()
  }, [tasks])

  const value: AppContextType = {
    refreshFolderTaskCounts,
    isIntroPlaying,
    setIntroPlaying,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
