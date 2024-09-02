// src/models/DressUpModel.ts
import mongoose, { Schema, Document } from "mongoose";

interface IDressUp extends Document {
  user: mongoose.Types.ObjectId;
  clothingItem: mongoose.Types.ObjectId;
  dressedUpImage: any;
  timestamp: Date;
}

const dressUpSchema = new Schema<IDressUp>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  clothingItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClothingItem",
    required: true,
  },
  dressedUpImage: { type: Schema.Types.Mixed, required: true },
  timestamp: { type: Date, default: Date.now },
});

const DressUpModel =
  mongoose.models.DressUp || mongoose.model<IDressUp>("DressUp", dressUpSchema);

export default DressUpModel;
