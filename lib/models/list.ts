import mongoose, { Schema, Document, models } from "mongoose";

export interface IList extends Document {
    userId:string
    name:string;
    isDefault: boolean;
    animeIds: number[];
    mangaIds: number[];
    thumbnail?: string | null;
mediaCount?: number;
    createdAt: Date; 
    updatedAt: Date;
}

const ListSchema = new Schema<IList>(
    {
        userId: {type:String, required: true, index: true},
        name: {type: String, required: true},
        isDefault: {type: Boolean, default: false},
        animeIds: {type: [Number], default: []},
        mangaIds: {type: [Number], default: []},
        thumbnail: {
        type: String,
        default: null,
        },
        mediaCount: {
          type: Number,
          default: 0,
        },
        
    },
    {timestamps: true}
)

const existingListModel = models.List as mongoose.Model<IList> | undefined;

if (existingListModel && !existingListModel.schema.path("mangaIds")) {
    existingListModel.schema.add({
        mangaIds: { type: [Number], default: [] },
    });
}

export const List = existingListModel || mongoose.model<IList>("List", ListSchema);