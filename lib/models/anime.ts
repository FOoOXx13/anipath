import mongoose, { Schema, Document, models } from "mongoose";


export interface IAnime extends Document {
    animeId: number;
    likesCount:number; 
    createdAt: Date; 
    updatedAt: Date;
}


const AnimeSchema = new Schema<IAnime>(
{
animeId: { type: Number, required: true, unique: true },
likesCount: { type: Number, default: 0, index: true },
},
{ timestamps: true }
);


export const Anime = models.Anime || mongoose.model<IAnime>("Anime", AnimeSchema);