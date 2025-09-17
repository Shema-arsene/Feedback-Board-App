import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/backend/lib/db"
import Feedback from "@/backend/models/Feedback"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect()

  try {
    const { action } = await req.json()
    const feedbackId = params.id

    if (!["increment", "decrement"].includes(action)) {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 })
    }

    const update = action === "increment" ? 1 : -1
    const feedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { $inc: { upvotes: update } },
      { new: true }
    )

    if (!feedback) {
      return NextResponse.json(
        { message: "Feedback not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ upvotes: feedback.upvotes })
  } catch (err: any) {
    console.error("Upvote error:", err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
