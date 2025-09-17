import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/backend/lib/db"
import Feedback from "@/backend/models/Feedback"
import Comment from "@/backend/models/Comment"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect()

  try {
    const id = params.id
    const item = await Feedback.findById(id).lean()
    if (!item)
      return NextResponse.json({ message: "Not found" }, { status: 404 })
    return NextResponse.json({ feedback: item })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect()

  try {
    const id = params.id
    const deleted = await Feedback.findByIdAndDelete(id)

    if (!deleted)
      return NextResponse.json({ message: "Not found" }, { status: 404 })

    // Cascade delete comments
    await Comment.deleteMany({ feedbackId: id })

    return NextResponse.json({
      message: "Feedback and its comments deleted successfully",
    })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
