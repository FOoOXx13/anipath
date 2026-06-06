import mongoose, { Schema, Document, models } from "mongoose";

export interface IMedia extends Document {
  mediaId: number;
  mediaType: "ANIME" | "MANGA";
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    mediaId: { type: Number, required: true },
    mediaType: { type: String, enum: ["ANIME", "MANGA"], required: true },
    likesCount: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

MediaSchema.index({ mediaId: 1, mediaType: 1 }, { unique: true });

export const Media = models.Media || mongoose.model<IMedia>("Media", MediaSchema);
