"use client"

import { motion } from "framer-motion"
import { Stethoscope, Trophy, BookOpen, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BlogCard } from "./blog-card"
import { useBlog } from "@/contexts/blog-context"

const categoryIcons = {
  "medical-news": Stethoscope,
  achievement: Trophy,
  "study-tips": BookOpen,
  general: MessageSquare,
}

const categoryTitles = {
  "medical-news": "Latest Medical News",
  achievement: "Success Stories & Achievements",
  "study-tips": "Study Tips & Guides",
  general: "General Discussions",
}

const categoryDescriptions = {
  "medical-news": "Stay updated with the latest medical research and healthcare innovations",
  achievement: "Celebrate success stories and achievements from our community",
  "study-tips": "Expert tips and strategies for medical education success",
  general: "General discussions and community conversations",
}

interface CategorySectionProps {
  category: "medical-news" | "achievement" | "study-tips" | "general"
}

export function CategorySection({ category }: CategorySectionProps) {
  const { getPostsByCategory, setFilters } = useBlog()
  const posts = getPostsByCategory(category)
  const Icon = categoryIcons[category]

  const handleViewAll = () => {
    setFilters({ category })
  }

  if (posts.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Icon className="h-6 w-6 text-primary" />
                {categoryTitles[category]}
              </CardTitle>
              <p className="text-muted-foreground mt-1">{categoryDescriptions[category]}</p>
            </div>
            <Button variant="outline" onClick={handleViewAll}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
