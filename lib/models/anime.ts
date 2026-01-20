import mongoose, { Schema, Document, models } from "mongoose";


export interface IAnime extends Document {
    animeId: number;
    likes: string[]; // Clerk userIds
    createdAt: Date;
    updatedAt: Date;
}


const AnimeSchema = new Schema<IAnime>(
{
animeId: { type: Number, required: true, unique: true },
likes: { type: [String], default: [] },
},
{ timestamps: true }
);


export const Anime = models.Anime || mongoose.model<IAnime>("Anime", AnimeSchema);