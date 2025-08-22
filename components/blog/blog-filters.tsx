"use client"

import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useBlog } from "@/contexts/blog-context"
import { useState } from "react"

export function BlogFilters() {
  const { filters, setFilters, posts } = useBlog()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setFilters({ ...filters, search: query })
  }

  const handleCategoryFilter = (category: string) => {
    setFilters({
      ...filters,
      category: category === "all" ? undefined : category,
    })
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery("")
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  // Get unique tags from all posts
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)))

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Search & Filter
          {activeFiltersCount > 0 && <Badge variant="secondary">{activeFiltersCount} active</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filters.category || "all"} onValueChange={handleCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="medical-news">Medical News</SelectItem>
              <SelectItem value="achievement">Achievements</SelectItem>
              <SelectItem value="study-tips">Study Tips</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.tag || "all"}
            onValueChange={(value) => setFilters({ ...filters, tag: value === "all" ? undefined : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {allTags.slice(0, 10).map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={clearFilters} disabled={activeFiltersCount === 0}>
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
