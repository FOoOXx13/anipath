import mongoose, { Schema, Document, models } from "mongoose";

export interface IList extends Document {
    userId:string
    name:string;
    isDefault: boolean;
    animeIds: number[];
    createdAt: Date; 
    updatedAt: Date;
}

const ListSchema = new Schema<IList>(
    {
        userId: {type:String, required: true, index: true},
        name: {type: String, required: true},
        isDefault: {type: Boolean, default: false},
        animeIds: {type: [Number], default: []},
    },
    {timestamps: true}
)

export const List = models.List || mongoose.model<IList>("List", ListSchema);