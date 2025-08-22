"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Folder, MoreHorizontal, Edit, Trash2, Plus, FolderOpen } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Folder as FolderType } from "@/types/folder"
import { useFolder } from "@/contexts/folder-context"

interface FolderCardProps {
  folder: FolderType
  onEdit: (folder: FolderType) => void
  onDelete: (folder: FolderType) => void
  onCreateChild: (parentFolder: FolderType) => void
  onSelect: (folder: FolderType) => void
}

export function FolderCard({ folder, onEdit, onDelete, onCreateChild, onSelect }: FolderCardProps) {
  const { loading } = useFolder()
  const [isHovered, setIsHovered] = useState(false)

  const handleFolderClick = () => {
    onSelect(folder)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleFolderClick}
    >
      <Card className="hover:shadow-lg transition-all duration-200 group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              <div
                className="p-2 rounded-lg flex-shrink-0"
                style={{ backgroundColor: `${folder.color}20`, color: folder.color }}
              >
                {isHovered ? <FolderOpen className="h-5 w-5" /> : <Folder className="h-5 w-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm break-words">{folder.name}</h3>
                {folder.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2 break-words">{folder.description}</p>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(folder); }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onCreateChild(folder); }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Subfolder
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => { e.stopPropagation(); onDelete(folder); }}
                  disabled={loading}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {folder.taskCount} task{folder.taskCount !== 1 ? "s" : ""}
            </Badge>
            {folder.color && (
              <div
                className="w-4 h-4 rounded-full border-2 border-background flex-shrink-0"
                style={{ backgroundColor: folder.color }}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
