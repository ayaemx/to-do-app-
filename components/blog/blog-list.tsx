"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Grid, List, SortAsc, Home, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { BlogCard } from "./blog-card"
import { BlogFilters } from "./blog-filters"
import { FeaturedSection } from "./featured-section"
import { CategorySection } from "./category-section"
import { CommunitySection } from "./community-section"
import { useBlog } from "@/contexts/blog-context"

export function BlogList() {
  const { getFilteredPosts, loading, error, filters, setFilters } = useBlog()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"date" | "likes" | "comments">("date")

  const posts = getFilteredPosts()

  const sortedPosts = [...posts].sort((a, b) => {
    switch (sortBy) {
      case "likes":
        return b.likes - a.likes
      case "comments":
        return b.comments - a.comments
      case "date":
      default:
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    }
  })

  const hasActiveFilters = Object.values(filters).some(Boolean)

  if (error) {
    return (
      <Card className="m-4">
        <CardContent className="pt-6">
          <div className="text-center text-red-600 dark:text-red-400">
            <p>Error: {error}</p>
            <Button variant="outline" onClick={() => window.location.reload()} className="mt-2">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Medical Community Blog</h1>
          <p className="text-muted-foreground">
            Discover insights, achievements, and knowledge from our medical community
          </p>
        </div>
      </div>

      {!hasActiveFilters && (
        <>
          <FeaturedSection />
          <CommunitySection />
          <CategorySection category="medical-news" />
          <CategorySection category="achievement" />
          <CategorySection category="study-tips" />
        </>
      )}

      {hasActiveFilters && (
        <>
          <div className="flex items-center text-sm text-muted-foreground">
            <Button variant="link" className="p-0 h-auto" onClick={() => setFilters({})}>
              <Home className="mr-2 h-4 w-4" />
              Blog
            </Button>
            <ChevronRight className="h-4 w-4" />
            <span className="font-semibold text-primary">{filters.category || filters.tag || "Search Results"}</span>
          </div>

          <BlogFilters />

          {/* View Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold">Search Results</h2>
              <p className="text-muted-foreground">
                {sortedPosts.length} post{sortedPosts.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">
                    <div className="flex items-center">
                      <SortAsc className="mr-2 h-4 w-4" />
                      Latest
                    </div>
                  </SelectItem>
                  <SelectItem value="likes">Most Liked</SelectItem>
                  <SelectItem value="comments">Most Discussed</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Posts Grid/List */}
          {loading ? (
            <div className={`grid ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}>
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-40 bg-muted rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-full mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : sortedPosts.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No posts found matching your criteria</p>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Clear all filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className={`grid ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}>
              <AnimatePresence>
                {sortedPosts.map((post) => (
                  <BlogCard key={post.id} post={post} variant={viewMode === "list" ? "compact" : "default"} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {!hasActiveFilters && <BlogFilters />}
    </div>
  )
}
