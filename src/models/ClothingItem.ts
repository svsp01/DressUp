import mongoose, { Schema, Document } from 'mongoose';

interface ClothingItem extends Document {
  userId: string;
  title: string;
  description: string;
  image: string;
  category: string;
  type: string;
  color: string;
  season: string;
  usageCount?: number; 
}

const ClothingItemSchema: Schema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true },
  color: { type: String, required: true },
  season: { type: String, required: true },
  usageCount: { type: Number, default: 0 } 
});

export default mongoose.models.ClothingItem || mongoose.model<ClothingItem>('ClothingItem', ClothingItemSchema);
