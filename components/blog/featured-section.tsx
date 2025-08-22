"use client"

import { motion } from "framer-motion"
import { Star, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BlogCard } from "./blog-card"
import { useBlog } from "@/contexts/blog-context"

export function FeaturedSection() {
  const { getFeaturedPosts } = useBlog()
  const featuredPosts = getFeaturedPosts()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Star className="h-6 w-6 text-yellow-500" />
            Featured Posts
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <BlogCard key={post.id} post={post} variant="featured" />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
