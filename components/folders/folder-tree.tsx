"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronDown, FolderIcon, FolderOpen, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Folder } from "@/types/folder"
import { useFolder } from "@/contexts/folder-context"

interface FolderTreeProps {
  onEditFolder: (folder: Folder) => void
  onDeleteFolder: (folder: Folder) => void
  onCreateChild: (parentFolder: Folder) => void
  onSelectFolder: (folder: Folder) => void
  selectedFolderId?: string
}

interface TreeNodeProps {
  folder: Folder
  level: number
  onEditFolder: (folder: Folder) => void
  onDeleteFolder: (folder: Folder) => void
  onCreateChild: (parentFolder: Folder) => void
  onSelectFolder: (folder: Folder) => void
  selectedFolderId?: string
}

function TreeNode({
  folder,
  level,
  onEditFolder,
  onDeleteFolder,
  onCreateChild,
  onSelectFolder,
  selectedFolderId,
}: TreeNodeProps) {
  const { expandedFolders, toggleFolder } = useFolder()
  const [isHovered, setIsHovered] = useState(false)

  const isExpanded = expandedFolders.has(folder.id)
  const hasChildren = folder.children && folder.children.length > 0
  const isSelected = selectedFolderId === folder.id

  const handleFolderClick = () => {
    onSelectFolder(folder)
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors group ${
          isSelected ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
        }`}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={handleFolderClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-1 flex-1 min-w-0">
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                toggleFolder(folder.id)
              }}
            >
              {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
          ) : (
            <div className="w-6" />
          )}

          <div
            className="p-1 rounded flex-shrink-0"
            style={{ backgroundColor: `${folder.color}20`, color: folder.color }}
          >
            {isHovered || isExpanded ? <FolderOpen className="h-4 w-4" /> : <FolderIcon className="h-4 w-4" />}
          </div>

          <span className="font-medium text-sm truncate flex-1">{folder.name}</span>

          <Badge variant="secondary" className="text-xs">
            {folder.taskCount}
          </Badge>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation()
              onCreateChild(folder)
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {folder.children?.map((child) => (
              <TreeNode
                key={child.id}
                folder={child}
                level={level + 1}
                onEditFolder={onEditFolder}
                onDeleteFolder={onDeleteFolder}
                onCreateChild={onCreateChild}
                onSelectFolder={onSelectFolder}
                selectedFolderId={selectedFolderId}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FolderTree({
  onEditFolder,
  onDeleteFolder,
  onCreateChild,
  onSelectFolder,
  selectedFolderId,
}: FolderTreeProps) {
  const { getFolderTree, loading } = useFolder()

  const folderTree = getFolderTree()

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 p-2 animate-pulse">
            <div className="w-4 h-4 bg-muted rounded" />
            <div className="w-4 h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded flex-1" />
            <div className="w-8 h-4 bg-muted rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {folderTree.map((folder) => (
        <TreeNode
          key={folder.id}
          folder={folder}
          level={0}
          onEditFolder={onEditFolder}
          onDeleteFolder={onDeleteFolder}
          onCreateChild={onCreateChild}
          onSelectFolder={onSelectFolder}
          selectedFolderId={selectedFolderId}
        />
      ))}
    </div>
  )
}
