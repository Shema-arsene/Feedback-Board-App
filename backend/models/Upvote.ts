import mongoose, { Document, Schema } from "mongoose"

export interface IUpvote extends Document {
  feedbackId: mongoose.Types.ObjectId
  userId?: mongoose.Types.ObjectId // if user-based
  sessionId?: string // if using anon sessions
  createdAt: Date
}

const UpvoteSchema = new Schema<IUpvote>(
  {
    feedbackId: {
      type: Schema.Types.ObjectId,
      ref: "Feedback",
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    sessionId: { type: String, required: false },
  },
  { timestamps: true }
)

UpvoteSchema.index({ feedbackId: 1, userId: 1 }, { unique: true, sparse: true })
UpvoteSchema.index(
  { feedbackId: 1, sessionId: 1 },
  { unique: true, sparse: true }
)

export default mongoose.models.Upvote ||
  mongoose.model<IUpvote>("Upvote", UpvoteSchema)
