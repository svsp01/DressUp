import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/DataBase/dbConnect";
import { verifyToken } from "@/middle/verifyToken";
import { Client } from "@gradio/client";

function base64ToBlob(base64: string): Buffer {
  const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string");
  }
  return Buffer.from(matches[2], "base64");
}

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

    let aiResponse;

    switch (Aitype) {
      case "texttotext":
        aiResponse = await handleTextToText(message);
        break;

      case "texttoimage":
        aiResponse = await handleTextToImage(message);
        break;

      case "imageclassification":
        aiResponse = await handleImageClassification(message, body);
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

async function handleTextToText(prompt: string) {
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
}

async function handleTextToImage(prompt: string) {
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
}

async function handleImageClassification(prompt: any, body: any) {
  const { dressImage } = body;

  const dressBlob = base64ToBlob(dressImage);

  const client = await Client.connect("maxiw/Phi-3.5-vision");

  const aiResponse = await client.predict("/run_example", {
    image: dressBlob,
    text_input: JSON.stringify({
      instruction: `Classify the image and provide detailed attributes with user inoput ${prompt}`,
      context: "Fashion analysis",
      details: {
        output_format: "detailed",
      },
    }),
    model_id: "microsoft/Phi-3.5-vision-instruct",
  });

  return aiResponse;
}
