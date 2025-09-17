"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Calendar, User } from "lucide-react"
import { UpvoteButton } from "./upvote-button"
import { FeedbackFilters, type FilterOptions } from "./feedback-filters"
import { CommentsSection } from "./comments-section"

interface FeedbackDocument {
  _id: string
  title: string
  description: string
  category: string
  status: string
  tags: string[]
  authorName?: string
  createdAt: string
  upvotes: number
}

interface FeedbackListProps {
  refreshTrigger?: number
}

export const FeedbackList = ({ refreshTrigger }: FeedbackListProps) => {
  const [feedback, setFeedback] = useState<FeedbackDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    category: "all",
    status: "all",
    sortBy: "newest",
  })

  const FetchFeedback = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/feedback")
      if (!res.ok) throw new Error("Failed to fetch feedback")
      const data: FeedbackDocument[] = await res.json()
      setFeedback(data)
    } catch (error) {
      console.error("Failed to load feedback:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    FetchFeedback()
  }, [refreshTrigger])

  const filteredAndSortedFeedback = useMemo(() => {
    let filtered = [...feedback]

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          (item.authorName &&
            item.authorName.toLowerCase().includes(searchLower))
      )
    }

    if (filters.category !== "all") {
      filtered = filtered.filter((item) => item.category === filters.category)
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((item) => item.status === filters.status)
    }

    switch (filters.sortBy) {
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        break
      case "most-upvoted":
        filtered.sort((a, b) => b.upvotes - a.upvotes)
        break
      case "least-upvoted":
        filtered.sort((a, b) => a.upvotes - b.upvotes)
        break
      case "newest":
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
    }

    return filtered
  }, [feedback, filters])

  const handleUpvoteChange = (feedbackId: string, newCount: number) => {
    setFeedback((prev) =>
      prev.map((item) =>
        item._id === feedbackId ? { ...item, upvotes: newCount } : item
      )
    )
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "feature":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "bug":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "improvement":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-muted rounded-lg animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-muted rounded w-full mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <FeedbackFilters
        filters={filters}
        onFiltersChange={setFilters}
        totalCount={feedback.length}
        filteredCount={filteredAndSortedFeedback.length}
      />

      {filteredAndSortedFeedback.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {feedback.length === 0
                ? "No feedback yet"
                : "No feedback matches your filters"}
            </h3>
            <p className="text-muted-foreground">
              {feedback.length === 0
                ? "Be the first to share your thoughts!"
                : "Try adjusting your search or filter criteria."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedFeedback.map((item) => (
            <Card key={item._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-balance leading-tight mb-2">
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.createdAt)}
                      </div>
                      {item.authorName && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {item.authorName}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <UpvoteButton
                      feedbackId={item._id}
                      initialUpvotes={item.upvotes}
                      onUpvoteChange={(newCount) =>
                        handleUpvoteChange(item._id, newCount)
                      }
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-pretty text-muted-foreground mb-4 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    className={getCategoryColor(item.category)}
                    variant="secondary"
                  >
                    {item.category}
                  </Badge>
                  <Badge
                    className={getStatusColor(item.status)}
                    variant="secondary"
                  >
                    {item.status}
                  </Badge>
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Comments Section */}
                <CommentsSection feedbackId={item._id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
