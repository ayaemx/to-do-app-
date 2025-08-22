import { renderHook, act } from "@testing-library/react"
import { FolderProvider, useFolder } from "@/contexts/folder-context"
import type { Folder, FolderFormData } from "@/types/folder"
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

const wrapper = ({ children }: { children: ReactNode }) => <FolderProvider>{children}</FolderProvider>

describe("FolderContext", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("should throw an error if useFolder is used outside of a FolderProvider", () => {
    const originalError = console.error
    console.error = jest.fn()
    expect(() => renderHook(() => useFolder())).toThrow("useFolder must be used within a FolderProvider")
    console.error = originalError
  })

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useFolder(), { wrapper })
    expect(result.current.folders).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.expandedFolders).toEqual(new Set(["1", "4"]))
  })

  it("should create a new folder", async () => {
    const { result } = renderHook(() => useFolder(), { wrapper })
    const folderData: FolderFormData = {
      name: "New Folder",
      color: "#ff0000",
    }

    await act(async () => {
      await result.current.createFolder(folderData)
    })

    expect(result.current.folders).toHaveLength(1)
    expect(result.current.folders[0].name).toBe("New Folder")
    expect(result.current.folders[0].taskCount).toBe(0)
  })

  it("should update an existing folder", async () => {
    const { result } = renderHook(() => useFolder(), { wrapper })
    await act(async () => {
      await result.current.createFolder({ name: "Original Name", color: "#ff0000" })
    })

    const folderId = result.current.folders[0].id
    const updatedData: Partial<FolderFormData> = {
      name: "Updated Name",
    }

    await act(async () => {
      await result.current.updateFolder(folderId, updatedData)
    })

    expect(result.current.folders[0].name).toBe("Updated Name")
  })

  it("should delete a folder and its children", async () => {
    const { result } = renderHook(() => useFolder(), { wrapper })
    let parentFolderId = ""
    await act(async () => {
      await result.current.createFolder({ name: "Parent", color: "#ff0000" })
    })
    const parentFolder = result.current.folders.find(f => f.name === "Parent")
    if (!parentFolder) throw new Error("Parent folder not found")
    parentFolderId = parentFolder.id

    await act(async () => {
      await result.current.createFolder({ name: "Child", parentId: parentFolderId, color: "#ff0000" })
    })

    expect(result.current.folders).toHaveLength(2)

    await act(async () => {
      await result.current.deleteFolder(parentFolderId)
    })

    expect(result.current.folders).toHaveLength(0)
  })

  it("should toggle a folder's expanded state", () => {
    const { result } = renderHook(() => useFolder(), { wrapper })
    
    act(() => {
      result.current.toggleFolder("1")
    })
    expect(result.current.expandedFolders).not.toContain("1")

    act(() => {
      result.current.toggleFolder("new-folder")
    })
    expect(result.current.expandedFolders).toContain("new-folder")
  })

  it("should build a folder tree", async () => {
    const { result } = renderHook(() => useFolder(), { wrapper })
    let parentId = ''
    await act(async () => {
      await result.current.createFolder({ name: "Root 1", color: "#ff0000" })
    })
    const parentFolder = result.current.folders.find(f => f.name === "Root 1")
    if (parentFolder) {
      parentId = parentFolder.id
      await act(async () => {
        await result.current.createFolder({ name: "Child 1", parentId, color: "#ff0000" })
        await result.current.createFolder({ name: "Root 2", color: "#ff0000" })
      })
    }

    const tree = result.current.getFolderTree()
    tree.sort((a, b) => a.name.localeCompare(b.name));
    expect(tree).toHaveLength(2)
    if (tree[0]) {
      expect(tree[0].name).toBe("Root 1")
      if (tree[0].children) {
        expect(tree[0].children).toHaveLength(1)
        if (tree[0].children[0]) {
          expect(tree[0].children[0].name).toBe("Child 1")
        }
      }
    }
    if (tree[1]) {
      expect(tree[1].name).toBe("Root 2")
    }
  })
})
