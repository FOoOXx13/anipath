import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },  
    imageUrl: { type: String, required: true },   
    animeId: { type: Number, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export const Comment =
  mongoose.models.Comment || mongoose.model("Comment", CommentSchema);