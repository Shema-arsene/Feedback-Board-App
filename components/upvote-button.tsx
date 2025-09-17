"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown } from "lucide-react"
import { toast } from "sonner"

interface UpvoteButtonProps {
  feedbackId: string
  initialUpvotes: number
  onUpvoteChange?: (newCount: number) => void
}

export function UpvoteButton({
  feedbackId,
  initialUpvotes,
  onUpvoteChange,
}: UpvoteButtonProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [hasUpvoted, setHasUpvoted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // check localStorage for previous upvote
  useEffect(() => {
    const voted = localStorage.getItem(`upvoted-${feedbackId}`)
    setHasUpvoted(!!voted)
  }, [feedbackId])

  const handleUpvote = async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      let newCount = upvotes

      if (hasUpvoted) {
        // Remove vote
        const res = await fetch(`/api/feedback/${feedbackId}/upvote`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "decrement" }),
        })
        if (!res.ok) throw new Error("Failed to remove upvote")

        newCount = upvotes - 1
        localStorage.removeItem(`upvoted-${feedbackId}`)
        setHasUpvoted(false)
        toast.error("Upvote removed", {
          description: "Your feedback is no longer upvoted.",
        })
      } else {
        // Add vote
        const res = await fetch(`/api/feedback/${feedbackId}/upvote`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "increment" }),
        })
        if (!res.ok) throw new Error("Failed to upvote")

        newCount = upvotes + 1
        localStorage.setItem(`upvoted-${feedbackId}`, "true")
        setHasUpvoted(true)
        toast.success("Thanks for the upvote", {
          description: "Your support has been recorded.",
        })
      }

      setUpvotes(newCount)
      onUpvoteChange?.(newCount)
    } catch (error) {
      console.error("Upvote failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={hasUpvoted ? "default" : "outline"}
      // variant="ghost" // prevent default shadcn styles from overriding
      size="sm"
      onClick={handleUpvote}
      disabled={isLoading}
      className={`flex items-center gap-1 min-w-0 transition-all ${
        hasUpvoted
          ? "bg-[var(--honolulu-blue)] text-white hover:bg-[var(--federal-blue)]"
          : "border border-[var(--honolulu-blue)] text-[var(--honolulu-blue)] hover:bg-[var(--honolulu-blue)] hover:text-white"
      } cursor-pointer`}
    >
      {hasUpvoted ? (
        <ChevronDown className="h-4 w-4 transition-transform text-white" />
      ) : (
        <ChevronUp className="h-4 w-4 transition-transform text-[var(--honolulu-blue)]" />
      )}
      <span className="font-medium">{upvotes}</span>
    </Button>
  )
}
