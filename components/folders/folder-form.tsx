"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Folder, FolderFormData } from "@/types/folder"
import { useFolder } from "@/contexts/folder-context"

interface FolderFormProps {
  isOpen: boolean
  onClose: () => void
  folder?: Folder
  parentFolder?: Folder
}

const colorOptions = [
  { value: "#3b82f6", label: "Blue" },
  { value: "#10b981", label: "Green" },
  { value: "#f59e0b", label: "Yellow" },
  { value: "#ef4444", label: "Red" },
  { value: "#8b5cf6", label: "Purple" },
  { value: "#06b6d4", label: "Cyan" },
  { value: "#ec4899", label: "Pink" },
  { value: "#6b7280", label: "Gray" },
]

export function FolderForm({ isOpen, onClose, folder, parentFolder }: FolderFormProps) {
  const { createFolder, updateFolder, loading, folders } = useFolder()
  const [formData, setFormData] = useState<FolderFormData>({
    name: "",
    description: "",
    color: "#3b82f6",
    parentId: parentFolder?.id,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (folder) {
      setFormData({
        name: folder.name,
        description: folder.description || "",
        color: folder.color || "#3b82f6",
        parentId: folder.parentId,
      })
    } else {
      setFormData({
        name: "",
        description: "",
        color: "#3b82f6",
        parentId: parentFolder?.id,
      })
    }
    setErrors({})
  }, [folder, parentFolder, isOpen])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Folder name is required"
    }

    // Check for duplicate names in the same parent
    const existingFolder = folders.find(
      (f) =>
        f.name.toLowerCase() === formData.name.toLowerCase() && f.parentId === formData.parentId && f.id !== folder?.id,
    )

    if (existingFolder) {
      newErrors.name = "A folder with this name already exists in the same location"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      if (folder) {
        await updateFolder(folder.id, formData)
      } else {
        await createFolder(formData)
      }
      onClose()
    } catch (error) {
      console.error("Failed to save folder:", error)
    }
  }

  const availableParentFolders = folders.filter((f) => !f.parentId && f.id !== folder?.id)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {folder ? "Edit Folder" : parentFolder ? `Create Subfolder in ${parentFolder.name}` : "Create New Folder"}
          </DialogTitle>
        </DialogHeader>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Folder Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter folder name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter folder description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Color</Label>
              <Select
                value={formData.color}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, color: value }))}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: formData.color }} />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }} />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!parentFolder && (
              <div className="space-y-2">
                <Label>Parent Folder</Label>
                <Select
                  value={formData.parentId || "none"}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, parentId: value === "none" ? undefined : value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent folder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Parent (Root Level)</SelectItem>
                    {availableParentFolders.map((parentFolder) => (
                      <SelectItem key={parentFolder.id} value={parentFolder.id}>
                        {parentFolder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : folder ? "Update Folder" : "Create Folder"}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  )
}
