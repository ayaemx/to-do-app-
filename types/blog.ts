export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  category: "medical-news" | "achievement" | "study-tips" | "general"
  author: {
    id: string
    name: string
    avatar: string
    role: string
  }
  tags: string[]
  readTime: number
  publishedAt: Date
  updatedAt: Date
  likes: number
  comments: number
  featured: boolean
  imageUrl?: string
}

export interface BlogCategory {
  id: string
  name: string
  description: string
  color: string
  icon: string
}

export interface BlogFilters {
  category?: string
  tag?: string
  search?: string
  author?: string
}

export interface BlogComment {
  id: string
  postId: string
  author: {
    id: string
    name: string
    avatar: string
  }
  content: string
  createdAt: Date
  likes: number
}
