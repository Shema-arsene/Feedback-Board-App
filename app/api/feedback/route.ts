import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/backend/lib/db"
import Feedback from "@/backend/models/Feedback"

export async function POST(req: NextRequest) {
  await dbConnect()

  try {
    const body = await req.json()
    const { title, category, description, authorName, authorEmail, tags } = body

    // validate
    if (!title || !description) {
      return NextResponse.json(
        { message: "Title and description are required." },
        { status: 400 }
      )
    }

    // create feedback (with no authentication)
    const newFeedback = await Feedback.create({
      title: title.trim(),
      category: category || "feature",
      description: description.trim(),
      authorName: authorName?.trim() || undefined,
      authorEmail: authorEmail?.trim() || undefined,
      tags,
      upvotes: 0,
      status: "open",
    })

    return NextResponse.json({ feedback: newFeedback }, { status: 201 })
  } catch (err: any) {
    console.error("create feedback error:", err)
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  await dbConnect()

  try {
    const url = new URL(req.url)
    // optional filters: category, status, tags
    const category = url.searchParams.get("category")
    const status = url.searchParams.get("status")
    const limit = Number(url.searchParams.get("limit") || 20)
    const skip = Number(url.searchParams.get("skip") || 0)

    const filter: any = {}
    if (category) filter.category = category
    if (status) filter.status = status

    const docs = await Feedback.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    return NextResponse.json(docs, { status: 200 })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { message: "Failed to list feedback" },
      { status: 500 }
    )
  }
}
