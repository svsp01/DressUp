import mongoose, { Schema, Document } from "mongoose";

interface IAIGeneration extends Document {
  user: mongoose.Types.ObjectId;
  aiType: string; // Type of AI interaction (e.g., "texttotext", "texttoimage", "imageclassification")
  prompt: string; // The prompt provided by the user
  aiResponse: any; // The AI's response or output
  additionalData: any; // Any other relevant data (e.g., AI description, metadata)
  timestamp: Date; // When the action occurred
}

const aiGenerationSchema = new Schema<IAIGeneration>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  aiType: { type: String, required: true },
  prompt: { type: String, required: true },
  aiResponse: { type: Schema.Types.Mixed, required: true },
  additionalData: { type: Schema.Types.Mixed, default: {} },
  timestamp: { type: Date, default: Date.now },
});

// Create or use existing model
const AIGenerationsModel =
  mongoose.models.AIGeneration ||
  mongoose.model<IAIGeneration>("AIGeneration", aiGenerationSchema);

export default AIGenerationsModel;
