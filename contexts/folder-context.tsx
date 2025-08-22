"use client"

import type React from "react"
import { useMemo } from "react"
import { createContext, useContext, useReducer, useCallback, useEffect } from "react"
import type { Folder, FolderFormData } from "@/types/folder"

interface FolderState {
  folders: Folder[]
  loading: boolean
  error: string | null
  expandedFolders: Set<string>
}

type FolderAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_FOLDERS"; payload: Folder[] }
  | { type: "ADD_FOLDER"; payload: Folder }
  | { type: "UPDATE_FOLDER"; payload: Folder }
  | { type: "DELETE_FOLDER"; payload: string }
  | { type: "TOGGLE_FOLDER"; payload: string }
  | { type: "UPDATE_TASK_COUNT"; payload: { folderId: string; count: number } }

const STORAGE_KEY = "coursology-folders"

const loadFoldersFromStorage = (): Folder[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const folders = JSON.parse(stored)
      return folders.map((folder: any) => ({
        ...folder,
        createdAt: new Date(folder.createdAt),
        updatedAt: new Date(folder.updatedAt),
      }))
    }
  } catch (error) {
    console.error('Failed to load folders from storage:', error)
  }
  return []
}

const saveFoldersToStorage = (folders: Folder[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(folders))
  } catch (error) {
    console.error('Failed to save folders to storage:', error)
  }
}

const initialState: FolderState = {
  folders: [],
  loading: false,
  error: null,
  expandedFolders: new Set(["1", "4"]),
}

const folderReducer = (state: FolderState, action: FolderAction): FolderState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }
    case "SET_FOLDERS":
      return { ...state, folders: action.payload, loading: false, error: null }
    case "ADD_FOLDER":
      return { ...state, folders: [...state.folders, action.payload], loading: false, error: null }
    case "UPDATE_FOLDER":
      return {
        ...state,
        folders: state.folders.map((folder) => (folder.id === action.payload.id ? action.payload : folder)),
        loading: false,
        error: null,
      }
    case "DELETE_FOLDER":
      return {
        ...state,
        folders: state.folders.filter((folder) => folder.id !== action.payload && folder.parentId !== action.payload),
        loading: false,
        error: null,
      }
    case "TOGGLE_FOLDER":
      const newExpanded = new Set(state.expandedFolders)
      if (newExpanded.has(action.payload)) {
        newExpanded.delete(action.payload)
      } else {
        newExpanded.add(action.payload)
      }
      return { ...state, expandedFolders: newExpanded }
    case "UPDATE_TASK_COUNT":
      return {
        ...state,
        folders: state.folders.map((folder) =>
          folder.id === action.payload.folderId ? { ...folder, taskCount: action.payload.count } : folder
        ),
      }
    default:
      return state
  }
}

interface FolderContextType extends FolderState {
  createFolder: (folderData: FolderFormData) => Promise<void>
  updateFolder: (id: string, folderData: Partial<FolderFormData>) => Promise<void>
  deleteFolder: (id: string) => Promise<{ success: boolean; affectedTasks: number }>
  toggleFolder: (id: string) => void
  getFolderTree: () => Folder[]
  getFolderById: (id: string) => Folder | undefined
  getChildFolders: (parentId: string) => Folder[]
  updateTaskCount: (folderId: string, count: number) => void
}

const FolderContext = createContext<FolderContextType | undefined>(undefined)

export function FolderProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(folderReducer, initialState)

  // Load folders from storage on initial mount
  useEffect(() => {
    const savedFolders = loadFoldersFromStorage()
    if (savedFolders.length > 0) {
      dispatch({ type: "SET_FOLDERS", payload: savedFolders })
    }
  }, [])

  // Save folders to storage whenever they change
  useEffect(() => {
    saveFoldersToStorage(state.folders)
  }, [state.folders])

  const createFolder = useCallback(async (folderData: FolderFormData) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      await new Promise((resolve) => setTimeout(resolve, 50))

      const newFolder: Folder = {
        id: Date.now().toString(),
        ...folderData,
        taskCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      dispatch({ type: "ADD_FOLDER", payload: newFolder })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to create folder" })
    }
  }, [])

  const updateFolder = useCallback(
    async (id: string, folderData: Partial<FolderFormData>) => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        await new Promise((resolve) => setTimeout(resolve, 50))

        const existingFolder = state.folders.find((folder) => folder.id === id)
        if (!existingFolder) {
          throw new Error("Folder not found")
        }

        const updatedFolder: Folder = {
          ...existingFolder,
          ...folderData,
          updatedAt: new Date(),
        }

        dispatch({ type: "UPDATE_FOLDER", payload: updatedFolder })
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to update folder" })
      }
    },
    [state.folders],
  )

  const deleteFolder = useCallback(
    async (id: string): Promise<{ success: boolean; affectedTasks: number }> => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        await new Promise((resolve) => setTimeout(resolve, 50))

        const folderToDelete = state.folders.find((f) => f.id === id)
        const childFolders = state.folders.filter((f) => f.parentId === id)
        const affectedTasks = (folderToDelete?.taskCount || 0) + childFolders.reduce((sum, f) => sum + f.taskCount, 0)

        dispatch({ type: "DELETE_FOLDER", payload: id })
        return { success: true, affectedTasks }
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to delete folder" })
        return { success: false, affectedTasks: 0 }
      }
    },
    [state.folders],
  )

  const toggleFolder = useCallback((id: string) => {
    dispatch({ type: "TOGGLE_FOLDER", payload: id })
  }, [])

  const getFolderTree = useCallback(() => {
    const buildTree = (parentId?: string): Folder[] => {
      return state.folders
        .filter((folder) => folder.parentId === parentId)
        .map((folder) => ({
          ...folder,
          children: buildTree(folder.id),
        }))
        .sort((a, b) => a.name.localeCompare(b.name))
    }

    return buildTree()
  }, [state.folders])

  const getFolderById = useCallback(
    (id: string) => {
      return state.folders.find((folder) => folder.id === id)
    },
    [state.folders],
  )

  const getChildFolders = useCallback(
    (parentId: string) => {
      return state.folders.filter((folder) => folder.parentId === parentId)
    },
    [state.folders],
  )

  const updateTaskCount = useCallback((folderId: string, count: number) => {
    dispatch({ type: "UPDATE_TASK_COUNT", payload: { folderId, count } })
  }, [])

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo<FolderContextType>(() => ({
    ...state,
    createFolder,
    updateFolder,
    deleteFolder,
    toggleFolder,
    getFolderTree,
    getFolderById,
    getChildFolders,
    updateTaskCount,
  }), [
    state,
    createFolder,
    updateFolder,
    deleteFolder,
    toggleFolder,
    getFolderTree,
    getFolderById,
    getChildFolders,
    updateTaskCount,
  ])

  return <FolderContext.Provider value={value}>{children}</FolderContext.Provider>
}

export function useFolder() {
  const context = useContext(FolderContext)
  if (context === undefined) {
    throw new Error("useFolder must be used within a FolderProvider")
  }
  return context
}