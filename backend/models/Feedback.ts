import mongoose, { Document, Schema } from "mongoose"

export interface IFeedback extends Document {
  title: string
  description: string
  category: "feature" | "bug" | "improvement" | "other"
  status: "open" | "in-progress" | "completed" | "rejected"
  upvotes: number
  authorName?: string
  authorEmail?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["feature", "bug", "improvement", "other"],
      default: "feature",
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "completed", "rejected"],
      default: "open",
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    authorName: {
      type: String,
    },
    authorEmail: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
)

// Indexes for search/filter
FeedbackSchema.index({ category: 1 })
FeedbackSchema.index({ tags: 1 })

export default mongoose.models.Feedback ||
  mongoose.model<IFeedback>("Feedback", FeedbackSchema)
