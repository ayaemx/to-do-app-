export interface Folder {
  id: string
  name: string
  description?: string
  color?: string
  parentId?: string
  createdAt: Date
  updatedAt: Date
  taskCount: number
  children?: Folder[]
}

export interface FolderFormData {
  name: string
  description?: string
  color?: string
  parentId?: string
}

export interface FolderTreeNode extends Folder {
  children: FolderTreeNode[]
  level: number
  isExpanded: boolean
}
