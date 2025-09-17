"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle } from "lucide-react"
import { toast } from "sonner"

interface Comment {
  _id: string
  feedbackId: string
  authorName: string
  content: string
  createdAt: string
}

export const CommentsSection = ({ feedbackId }: { feedbackId: string }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [visibleCount, setVisibleCount] = useState(3)
  const [loading, setLoading] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [authorName, setAuthorName] = useState("")

  // Fetch comments
  const fetchComments = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/feedback/${feedbackId}/comments`)
      if (!res.ok) throw new Error("Failed to fetch comments")
      const data = await res.json()
      setComments(data.comments || [])
    } catch (error) {
      console.error(error)
      toast.error("Failed to load comments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [feedbackId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !authorName.trim()) {
      toast.error("Please enter your name and content to comment", {
        description: "Both fields are required.",
      })
      return
    }

    const optimisticComment: Comment = {
      _id: `temp-${Date.now()}`,
      feedbackId,
      authorName,
      content: newComment,
      createdAt: new Date().toISOString(),
    }

    setComments((prev) => [optimisticComment, ...prev])
    setNewComment("")

    try {
      const res = await fetch(`/api/feedback/${feedbackId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName,
          content: optimisticComment.content,
        }),
      })
      if (res.ok) {
        toast.success("Comment posted successfully!", {
          description: "Thank you for your feedback!",
        })
        fetchComments()
      }
    } catch (err) {
      console.error("Failed to post comment", err)
      toast.error("Error adding comment", {
        description: "Something went wrong while posting your comment.",
      })
    }
  }

  const visibleComments = comments.slice(0, visibleCount)

  return (
    <div className="mt-4 space-y-3">
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <MessageCircle className="h-4 w-4" /> No comments yet
        </p>
      ) : (
        <div className="space-y-2">
          {visibleComments.map((comment) => (
            <Card key={comment._id} className="p-3 text-sm">
              <p className="font-medium">{comment.authorName}</p>
              <p className="text-muted-foreground">{comment.content}</p>
            </Card>
          ))}

          {comments.length > visibleCount && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setVisibleCount((prev) => (prev === 3 ? comments.length : 3))
              }
            >
              {visibleCount === 3
                ? `View all ${comments.length} comments`
                : "Show less"}
            </Button>
          )}
        </div>
      )}

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Your name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="max-w-[150px]"
        />
        <Input
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="sm">
          Post
        </Button>
      </form>
    </div>
  )
}
