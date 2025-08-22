"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Plus, Search, Grid, List, ChevronRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FolderCard } from "./folder-card"
import { FolderForm } from "./folder-form"
import { FolderTree } from "./folder-tree"
import { DeleteFolderDialog } from "./delete-folder-dialog"
import { useFolder } from "@/contexts/folder-context"
import { TaskList } from "@/components/tasks/task-list"
import type { Folder } from "@/types/folder"

export function FolderList() {
  const { folders, deleteFolder, loading, error } = useFolder()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingFolder, setEditingFolder] = useState<Folder | undefined>()
  const [parentFolder, setParentFolder] = useState<Folder | undefined>()
  const [deletingFolder, setDeletingFolder] = useState<Folder | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null)

  const filteredFolders = folders.filter(
    (folder) =>
      folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      folder.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const rootFolders = filteredFolders.filter((folder) => !folder.parentId)

  const handleEditFolder = (folder: Folder) => {
    setEditingFolder(folder)
    setParentFolder(undefined)
    setIsFormOpen(true)
  }

  const handleDeleteFolder = (folder: Folder) => {
    setDeletingFolder(folder)
  }

  const handleCreateChild = (parent: Folder) => {
    setParentFolder(parent)
    setEditingFolder(undefined)
    setIsFormOpen(true)
  }

  const handleSelectFolder = (folder: Folder) => {
    setSelectedFolder(folder)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingFolder(undefined)
    setParentFolder(undefined)
  }

  const handleConfirmDelete = async () => {
    if (deletingFolder) {
      await deleteFolder(deletingFolder.id)
      setDeletingFolder(null)
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

  if (selectedFolder) {
    return (
      <div>
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Button variant="link" className="p-0 h-auto" onClick={() => setSelectedFolder(null)}>
            <Home className="mr-2 h-4 w-4" />
            Folders
          </Button>
          <ChevronRight className="h-4 w-4" />
          <span className="font-semibold text-primary">{selectedFolder.name}</span>
        </div>
        <TaskList folderId={selectedFolder.id} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Folders</h1>
          <p className="text-muted-foreground">
            {folders.length} folder{folders.length !== 1 ? "s" : ""} •{" "}
            {folders.reduce((sum, f) => sum + f.taskCount, 0)} total tasks
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Folder
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Folders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Folder Views */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <Grid className="h-4 w-4" />
            Grid View
          </TabsTrigger>
          <TabsTrigger value="tree" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Tree View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            <p>📁 Showing top-level (parent) folders. Click on any folder to view its tasks and subfolders.</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-3 bg-muted rounded w-full mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : rootFolders.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No folders found</p>
                  <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create your first folder
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {rootFolders.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    folder={folder}
                    onEdit={handleEditFolder}
                    onDelete={handleDeleteFolder}
                    onCreateChild={handleCreateChild}
                    onSelect={handleSelectFolder}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tree" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Folder Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <FolderTree
                onSelectFolder={handleSelectFolder}
                onEditFolder={handleEditFolder}
                onDeleteFolder={handleDeleteFolder}
                onCreateChild={handleCreateChild}
                selectedFolderId={selectedFolder?.id}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Folder Form Modal */}
      <FolderForm isOpen={isFormOpen} onClose={handleCloseForm} folder={editingFolder} parentFolder={parentFolder} />

      {/* Delete Confirmation Dialog */}
      <DeleteFolderDialog
        folder={deletingFolder}
        isOpen={!!deletingFolder}
        onClose={() => setDeletingFolder(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
