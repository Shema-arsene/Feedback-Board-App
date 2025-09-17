import { NextResponse } from "next/server"
import dbConnect from "@/backend/lib/db"
import Comment from "@/backend/models/Comment"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect()

  try {
    const { id } = params
    const comments = await Comment.find({ feedbackId: id }).sort({
      createdAt: -1,
    })
    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments for feedback:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}
