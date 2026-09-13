import mongoose, { Schema, Document, models } from "mongoose";

export interface IAnime extends Document {
  mediaId: number;
  title: string;
  description: string;
  episodes: number;
  genres: string[];
}

const AnimeSchema = new Schema<IAnime>(
  {
    mediaId: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    episodes: {
      type: Number,
      default: 0,
    },

    genres: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

AnimeSchema.index({ mediaId: 1 }, { unique: true });

export const Anime =
  models.Anime || mongoose.model<IAnime>("Anime", AnimeSchema);