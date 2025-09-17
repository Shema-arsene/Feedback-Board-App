import { NextResponse } from "next/server"
import dbConnect from "@/backend/lib/db"
import Comment from "@/backend/models/Comment"

// Create a new comment
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect()
  const body = await req.json()

  try {
    const { id } = await context.params
    const { authorName, content } = body

    if (!authorName || !content) {
      return NextResponse.json(
        { error: "authorName and content are required!" },
        { status: 400 }
      )
    }

    const comment = await Comment.create({
      feedbackId: id,
      authorName,
      content,
    })
    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    )
  }
}

// Get all comments
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect()

  try {
    const { id } = await context.params
    const comments = await Comment.find({ feedbackId: id }).sort({
      createdAt: -1,
    })
    return NextResponse.json({ comments })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}
