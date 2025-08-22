"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import type { Folder } from "@/types/folder"
import { useFolder } from "@/contexts/folder-context"

interface DeleteFolderDialogProps {
  folder: Folder | null
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteFolderDialog({ folder, isOpen, onClose, onConfirm }: DeleteFolderDialogProps) {
  const { getChildFolders, loading } = useFolder()
  const [isDeleting, setIsDeleting] = useState(false)

  if (!folder) return null

  const childFolders = getChildFolders(folder.id)
  const totalChildTasks = childFolders.reduce((sum, child) => sum + child.taskCount, 0)
  const totalAffectedTasks = folder.taskCount + totalChildTasks
  const hasChildren = childFolders.length > 0

  const handleConfirm = async () => {
    setIsDeleting(true)
    await onConfirm()
    setIsDeleting(false)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Folder
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Are you sure you want to delete the folder <strong>"{folder.name}"</strong>?
            </p>

            {hasChildren && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  This folder contains subfolders:
                </p>
                <div className="flex flex-wrap gap-1">
                  {childFolders.map((child) => (
                    <Badge key={child.id} variant="outline" className="text-xs">
                      {child.name} ({child.taskCount} tasks)
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {totalAffectedTasks > 0 && (
              <div className="p-3 bg-destructive dark:bg-destructive/80 rounded-lg border border-destructive/50">
                <p className="text-sm font-semibold text-destructive-foreground">
                  <strong>{totalAffectedTasks}</strong> task{totalAffectedTasks !== 1 ? "s" : ""} will be permanently
                  deleted:
                </p>
                <ul className="text-sm text-destructive-foreground/90 mt-1 space-y-1">
                  <li>• {folder.taskCount} tasks in this folder</li>
                  {hasChildren && <li>• {totalChildTasks} tasks in subfolders</li>}
                </ul>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              This action cannot be undone. All data associated with this folder and its subfolders will be permanently
              removed.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting || loading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? "Deleting..." : "Delete Folder"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
