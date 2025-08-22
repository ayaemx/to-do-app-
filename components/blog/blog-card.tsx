"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, Heart, MessageCircle, Tag } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { BlogPost } from "@/types/blog"
import { useBlog } from "@/contexts/blog-context"
import { format } from "date-fns"

interface BlogCardProps {
  post: BlogPost
  variant?: "default" | "featured" | "compact"
}

const categoryColors = {
  "medical-news": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  achievement: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "study-tips": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  general: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
}

const categoryLabels = {
  "medical-news": "Medical News",
  achievement: "Achievement",
  "study-tips": "Study Tips",
  general: "General",
}

export function BlogCard({ post, variant = "default" }: BlogCardProps) {
  const { likePost } = useBlog()

  const handleLike = () => {
    likePost(post.id)
  }

  if (variant === "compact") {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex gap-4">
              {post.imageUrl && (
                <img
                  src={post.imageUrl || "/placeholder.svg"}
                  alt={post.title}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <Badge className={categoryColors[post.category]} variant="secondary">
                  {categoryLabels[post.category]}
                </Badge>
                <h3 className="font-semibold text-sm mt-2 line-clamp-2">{post.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(post.publishedAt), "MMM dd")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime} min
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          {post.imageUrl && (
            <div className="relative h-48">
              <img src={post.imageUrl || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4">
                <Badge className={categoryColors[post.category]} variant="secondary">
                  {categoryLabels[post.category]}
                </Badge>
              </div>
            </div>
          )}
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h2>
            <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{post.author.name}</p>
                  <p className="text-xs text-muted-foreground">{post.author.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readTime} min
                </div>
                <Button variant="ghost" size="sm" onClick={handleLike}>
                  <Heart className="h-4 w-4 mr-1" />
                  {post.likes}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        {post.imageUrl && (
          <div className="relative h-40">
            <img src={post.imageUrl || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3">
              <Badge className={categoryColors[post.category]} variant="secondary">
                {categoryLabels[post.category]}
              </Badge>
            </div>
          </div>
        )}
        <CardHeader className="pb-3">
          <h3 className="font-semibold line-clamp-2">{post.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{post.author.name}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {post.readTime} min
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(post.publishedAt), "MMM dd, yyyy")}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleLike}>
                <Heart className="h-3 w-3 mr-1" />
                {post.likes}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="h-3 w-3 mr-1" />
                {post.comments}
              </Button>
            </div>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="h-2 w-2 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
