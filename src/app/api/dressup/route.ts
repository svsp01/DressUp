import dbConnect from "@/DataBase/dbConnect";
import { NextRequest, NextResponse } from "next/server";
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
    const body = await request.json();

    if (body) {
      const { humanImage, dressImage } = body;

      const client = await Client.connect("Kwai-Kolors/Kolors-Virtual-Try-On");

      const humanBlob = base64ToBlob(humanImage);
      const dressBlob = base64ToBlob(dressImage);

      const result = await Promise.race([
        client.predict("/tryon", {
          person_img: humanBlob,
          garment_img: dressBlob,
          seed: 0,
          randomize_seed: true,
        }),
        new Promise(
          (_, reject) =>
            setTimeout(() => reject(new Error("Request timed out")), 120000)
        ),
      ]);

      console.log(result, ">>>>>");
      const dressedUpImage = result;

      return NextResponse.json(
        { message: "Dressed Up successfully", result: dressedUpImage },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
