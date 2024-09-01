import mongoose, { Schema, Document } from "mongoose";

interface TrendingItem extends Document {
  title: string;
  description: string;
  category: string;
  type: string;
  color: string;
  season: string;
  imgUrl: string;
  width: number;
  height: number;
  deleted?: boolean;
  reported?: boolean;
}

const TrendingItemSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true },
  color: { type: String, required: true },
  season: { type: String, required: true },
  reporters: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      feedback: { type: String, required: false },
    },
  ],
  deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.models.TrendingItem ||
  mongoose.model<TrendingItem>("TrendingItem", TrendingItemSchema);
