"use client"

import type React from "react"
import { createContext, useContext, useReducer, useCallback } from "react"
import type { BlogPost, BlogFilters, BlogComment } from "@/types/blog"

interface BlogState {
  posts: BlogPost[]
  comments: BlogComment[]
  loading: boolean
  error: string | null
  filters: BlogFilters
}

type BlogAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_POSTS"; payload: BlogPost[] }
  | { type: "ADD_POST"; payload: BlogPost }
  | { type: "UPDATE_POST"; payload: BlogPost }
  | { type: "DELETE_POST"; payload: string }
  | { type: "SET_FILTERS"; payload: BlogFilters }
  | { type: "LIKE_POST"; payload: string }

const initialPosts: BlogPost[] = [
  {
    id: "1",
    title: "Latest Medical Test Innovations in 2024",
    content: "Discover the cutting-edge medical testing technologies that are revolutionizing healthcare...",
    excerpt: "Explore the latest innovations in medical testing technology and their impact on patient care.",
    category: "medical-news",
    author: {
      id: "1",
      name: "Dr. Sarah Johnson",
      avatar: "/placeholder-user.jpg",
      role: "Medical Researcher",
    },
    tags: ["medical-technology", "innovation", "healthcare"],
    readTime: 5,
    publishedAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    likes: 42,
    comments: 8,
    featured: true,
    imageUrl: "/medical-technology-innovation.png",
  },
  {
    id: "2",
    title: "My Journey to Passing the Medical Board Exams",
    content: "After months of preparation using Coursology QBank, I finally achieved my goal...",
    excerpt: "A personal story of dedication, study strategies, and success in medical board examinations.",
    category: "achievement",
    author: {
      id: "2",
      name: "Ahmed Hassan",
      avatar: "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg",
      role: "Medical Student",
    },
    tags: ["success-story", "medical-boards", "study-tips"],
    readTime: 8,
    publishedAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    likes: 156,
    comments: 23,
    featured: true,
    imageUrl: "/medical-student-success.png",
  },
  {
    id: "3",
    title: "Understanding Blood Test Results: A Complete Guide",
    content: "Learn how to interpret common blood test results and what they mean for your health...",
    excerpt: "A comprehensive guide to understanding and interpreting blood test results for medical professionals.",
    category: "medical-news",
    author: {
      id: "3",
      name: "Dr. Michael Chen",
      avatar: "https://pbs.twimg.com/profile_images/1677042510839857154/Kq4tpySA_400x400.jpg",
      role: "Laboratory Director",
    },
    tags: ["blood-tests", "diagnostics", "medical-education"],
    readTime: 12,
    publishedAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08"),
    likes: 89,
    comments: 15,
    featured: false,
    imageUrl: "/placeholder-zcrt7.png",
  },
  {
    id: "4",
    title: "Effective Study Techniques for Medical Students",
    content: "Discover proven study methods that helped me excel in medical school...",
    excerpt: "Time-tested study techniques and strategies specifically designed for medical education success.",
    category: "study-tips",
    author: {
      id: "4",
      name: "Dr. Emily Rodriguez",
      avatar: "https://pbs.twimg.com/profile_images/1783856060249595904/8TfcCN0r_400x400.jpg",
      role: "Medical Educator",
    },
    tags: ["study-methods", "medical-education", "productivity"],
    readTime: 6,
    publishedAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
    likes: 234,
    comments: 31,
    featured: false,
    imageUrl: "/placeholder-1n6ux.png",
  },
  {
    id: "5",
    title: "Celebrating 1000+ Successful QBank Users!",
    content:
      "We're thrilled to announce that over 1000 medical students have successfully passed their exams using our platform...",
    excerpt: "Milestone celebration: Over 1000 medical students have achieved success with Coursology QBank.",
    category: "achievement",
    author: {
      id: "5",
      name: "Coursology Team",
      avatar: "https://pbs.twimg.com/profile_images/1534700564810018816/anAuSfkp_400x400.jpg",
      role: "Platform Team",
    },
    tags: ["milestone", "success", "community"],
    readTime: 3,
    publishedAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    likes: 312,
    comments: 45,
    featured: true,
    imageUrl: "/medical-students-celebration.png",
  },
]

const initialState: BlogState = {
  posts: initialPosts,
  comments: [],
  loading: false,
  error: null,
  filters: {},
}

const blogReducer = (state: BlogState, action: BlogAction): BlogState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }
    case "SET_POSTS":
      return { ...state, posts: action.payload, loading: false, error: null }
    case "ADD_POST":
      return { ...state, posts: [action.payload, ...state.posts], loading: false, error: null }
    case "UPDATE_POST":
      return {
        ...state,
        posts: state.posts.map((post) => (post.id === action.payload.id ? action.payload : post)),
        loading: false,
        error: null,
      }
    case "DELETE_POST":
      return {
        ...state,
        posts: state.posts.filter((post) => post.id !== action.payload),
        loading: false,
        error: null,
      }
    case "SET_FILTERS":
      return { ...state, filters: action.payload }
    case "LIKE_POST":
      return {
        ...state,
        posts: state.posts.map((post) => (post.id === action.payload ? { ...post, likes: post.likes + 1 } : post)),
      }
    default:
      return state
  }
}

interface BlogContextType extends BlogState {
  setFilters: (filters: BlogFilters) => void
  getFilteredPosts: () => BlogPost[]
  getFeaturedPosts: () => BlogPost[]
  getPostsByCategory: (category: string) => BlogPost[]
  likePost: (postId: string) => void
  searchPosts: (query: string) => BlogPost[]
}

const BlogContext = createContext<BlogContextType | undefined>(undefined)

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(blogReducer, initialState)

  const setFilters = useCallback((filters: BlogFilters) => {
    dispatch({ type: "SET_FILTERS", payload: filters })
  }, [])

  const getFilteredPosts = useCallback(() => {
    let filtered = state.posts

    if (state.filters.category) {
      filtered = filtered.filter((post) => post.category === state.filters.category)
    }

    if (state.filters.tag) {
      filtered = filtered.filter((post) => post.tags && post.tags.includes(state.filters.tag!))
    }

    if (state.filters.search) {
      const search = state.filters.search.toLowerCase()
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(search) ||
          post.content.toLowerCase().includes(search) ||
          post.excerpt.toLowerCase().includes(search) ||
          post.tags.some((tag) => tag.toLowerCase().includes(search)),
      )
    }

    if (state.filters.author) {
      filtered = filtered.filter((post) => post.author.id === state.filters.author)
    }

    return filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  }, [state.posts, state.filters])

  const getFeaturedPosts = useCallback(() => {
    return state.posts.filter((post) => post.featured).slice(0, 3)
  }, [state.posts])

  const getPostsByCategory = useCallback(
    (category: string) => {
      return state.posts.filter((post) => post.category === category).slice(0, 6)
    },
    [state.posts],
  )

  const likePost = useCallback((postId: string) => {
    dispatch({ type: "LIKE_POST", payload: postId })
  }, [])

  const searchPosts = useCallback(
    (query: string) => {
      const search = query.toLowerCase()
      return state.posts.filter(
        (post) =>
          post.title.toLowerCase().includes(search) ||
          post.content.toLowerCase().includes(search) ||
          post.excerpt.toLowerCase().includes(search) ||
          post.tags.some((tag) => tag.toLowerCase().includes(search)),
      )
    },
    [state.posts],
  )

  const value: BlogContextType = {
    ...state,
    setFilters,
    getFilteredPosts,
    getFeaturedPosts,
    getPostsByCategory,
    likePost,
    searchPosts,
  }

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>
}

export function useBlog() {
  const context = useContext(BlogContext)
  if (context === undefined) {
    throw new Error("useBlog must be used within a BlogProvider")
  }
  return context
}
