import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/DataBase/dbConnect";
import { verifyToken } from "@/middle/verifyToken";
import { Client } from "@gradio/client";
import mongoose from "mongoose";
import AIGenerationsModel from "@/models/AIGenerationsModel";
import { ObjectId } from "mongodb";
import { v2 as cloudinary } from "cloudinary";

// import cloudinary from 'cloudinary';
// import mongoose from 'mongoose';
// import { NextRequest, NextResponse } from 'next/server';
// import { AIGenerationsModel } from './models/AIGenerations';
// import { dbConnect, verifyToken } from './utils';

// Cloudinary configuration with error handling
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} catch (error) {
  console.error("Error configuring Cloudinary:", error);
  throw new Error("Cloudinary configuration failed");
}

// Function to upload image to Cloudinary with enhanced error handling
const uploadToCloudinary = async (url: string): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(url, {
      folder: "ai_generations",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

// Function to convert base64 to Blob with enhanced error handling
function base64ToBlob(base64: string): Buffer {
  try {
    const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error("Invalid base64 string");
    }
    return Buffer.from(matches[2], "base64");
  } catch (error) {
    console.error("Error converting base64 to Blob:", error);
    throw new Error("Failed to convert base64 string to Blob");
  }
}

// Function to save AI generation data with enhanced error handling
async function saveAIGeneration(
  user: mongoose.Types.ObjectId,
  aiType: string,
  prompt: string,
  aiResponse: any,
  additionalData: any = {}
) {
  try {
    const newAIGeneration = new AIGenerationsModel({
      user,
      aiType,
      prompt,
      aiResponse,
      additionalData,
    });
    await newAIGeneration.save();
  } catch (error) {
    console.error("Error saving AI generation:", error);
    throw new Error("Failed to save AI generation");
  }
}

// POST request handler with enhanced error handling
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json({ reply: "Unauthorized" }, { status: 401 });
    }

    const { message, Aitype, body } = await request.json();
    if (!message) {
      return NextResponse.json(
        { reply: "Message is required" },
        { status: 400 }
      );
    }

    let aiResponse: any;
    let responseImageUrl: string | undefined;

    switch (Aitype) {
      case "texttotext":
        aiResponse = await handleTextToText(message);
        await saveAIGeneration(
          new mongoose.Types.ObjectId(userId),
          "texttotext",
          message,
          aiResponse
        );
        break;

      case "texttoimage":
        aiResponse = await handleTextToImage(message);

        try {
          const cloudinaryUrl = await uploadToCloudinary(
            aiResponse.data[0].url
          );
          await saveAIGeneration(
            new mongoose.Types.ObjectId(userId),
            "texttoimage",
            message,
            aiResponse,
            { imageUrl: cloudinaryUrl }
          );
        } catch (error) {
          console.warn(
            "Using AI response URL due to Cloudinary upload error:",
            error
          );
          await saveAIGeneration(
            new mongoose.Types.ObjectId(userId),
            "texttoimage",
            message,
            aiResponse,
            { imageUrl: aiResponse.data[0].url }
          );
        }
        break;

      case "imageclassification":
        aiResponse = await handleImageClassification(message, body);
        await saveAIGeneration(
          new mongoose.Types.ObjectId(userId),
          "imageclassification",
          message,
          aiResponse
        );
        break;

      default:
        return NextResponse.json(
          { reply: "Invalid AI type provided" },
          { status: 400 }
        );
    }

    if (!aiResponse || !aiResponse.data) {
      return NextResponse.json(
        { reply: "Failed to retrieve AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        result: {
          type: "data",
          time: new Date().toISOString(),
          data: aiResponse.data,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { reply: "Failed to process message" },
      { status: 500 }
    );
  }
}

// Function to handle text-to-text AI requests with enhanced error handling
async function handleTextToText(prompt: string) {
  try {
    const client = await Client.connect("srikanthkaraka/chatbot-lama3.1");

    const aiResponse = await client.predict("/chat", {
      user_input: JSON.stringify({
        instruction: "Generate a detailed and insightful response",
        prompt: prompt,
        context: {
          language: "en",
          tone: "professional",
          detail_level: "high",
        },
      }),
    });

    return aiResponse;
  } catch (error) {
    console.error("Error in handleTextToText:", error);
    throw new Error("Failed to process text-to-text AI request");
  }
}

// Function to handle text-to-image AI requests with enhanced error handling
async function handleTextToImage(prompt: string) {
  try {
    const client = await Client.connect("multimodalart/FLUX.1-merged");

    const aiResponse = await client.predict("/infer", {
      prompt: `${prompt}`,
      seed: 42,
      randomize_seed: true,
      width: 1024,
      height: 1024,
      guidance_scale: 3.5,
      num_inference_steps: 8,
    });

    return aiResponse;
  } catch (error) {
    console.error("Error in handleTextToImage:", error);
    throw new Error("Failed to process text-to-image AI request");
  }
}

// Function to handle image classification AI requests with enhanced error handling
async function handleImageClassification(prompt: any, body: any) {
  try {
    const { dressImage } = body;
    const dressBlob = base64ToBlob(dressImage);

    const client = await Client.connect("maxiw/Phi-3.5-vision");

    const aiResponse = await client.predict("/run_example", {
      image: dressBlob,
      text_input: JSON.stringify({
        instruction: `Classify the image and provide detailed attributes with user input ${prompt}`,
        context: "Fashion analysis",
        details: {
          output_format: "detailed",
        },
      }),
      model_id: "microsoft/Phi-3.5-vision-instruct",
    });

    return aiResponse;
  } catch (error) {
    console.error("Error in handleImageClassification:", error);
    throw new Error("Failed to process image classification AI request");
  }
}
