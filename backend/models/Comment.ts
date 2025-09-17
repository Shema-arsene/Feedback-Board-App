import mongoose, { Schema, Document, model } from "mongoose"

export interface IComment extends Document {
  feedbackId: mongoose.Types.ObjectId
  authorName: string
  authorEmail?: string
  content: string
  // createdAt: Date
}

const CommentSchema = new Schema<IComment>(
  {
    feedbackId: {
      type: Schema.Types.ObjectId,
      ref: "Feedback",
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorEmail: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.models.Comment ||
  model<IComment>("Comment", CommentSchema)
