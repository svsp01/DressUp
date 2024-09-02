// import dbConnect from "@/DataBase/dbConnect";
// import { NextRequest, NextResponse } from "next/server";
// import { Client } from "@gradio/client";

// function base64ToBlob(base64: string): Buffer {
//   const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
//   if (!matches || matches.length !== 3) {
//     throw new Error("Invalid base64 string");
//   }
//   return Buffer.from(matches[2], "base64");
// }

// export async function POST(request: NextRequest) {
//   try {
//     await dbConnect();
//     const body = await request.json();

//     if (body) {

//       const { humanImage, dressImage } = body;
//       const client = await Client.connect("Kwai-Kolors/Kolors-Virtual-Try-On");

//       const humanBlob = base64ToBlob(humanImage);
//       const dressBlob = base64ToBlob(dressImage);

//       const result = await Promise.race([
//         client.predict("/tryon", {
//           person_img: humanBlob,
//           garment_img: dressBlob,
//           seed: 0,
//           randomize_seed: true,
//         }),
//         new Promise(
//           (_, reject) =>
//             setTimeout(() => reject(new Error("Request timed out")), 120000)
//         ),
//       ]);

//       console.log(result, ">>>>>");
//       const dressedUpImage = result;

//       return NextResponse.json(
//         { message: "Dressed Up successfully", result: dressedUpImage },
//         { status: 201 }
//       );
//     }
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: error }, { status: 500 });
//   }
// }

import dbConnect from "@/DataBase/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { Client } from "@gradio/client";
import ClothingItemModel from "@/models/ClothingItem";
import { verifyToken } from "@/middle/verifyToken";
import DressUpModel from "@/models/DressUpModel";
import mongoose, { isValidObjectId } from "mongoose";

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

    // Verify token and get user ID
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json({ reply: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (body) {
      const { humanImage, dressImage, clothingItemId } = body;
      if (!isValidObjectId(clothingItemId)) {
        return NextResponse.json(
          { reply: "Invalid ID format" },
          { status: 400 }
        );
      }
      // Fetch the clothing item from the database
      const clothingItem = await ClothingItemModel.findById(clothingItemId);

      if (!clothingItem) {
        return NextResponse.json(
          { error: "Clothing Item not found" },
          { status: 404 }
        );
      }

      const client = await Client.connect("Sakthisvsp/Kolors-Virtual-Try-On");

      const humanBlob = base64ToBlob(humanImage);
      const dressBlob = base64ToBlob(dressImage);

      const result: any = await Promise.race([
        client.predict("/tryon", {
          person_img: humanBlob,
          garment_img: dressBlob,
          seed: 0,
          randomize_seed: true,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timed out")), 120000)
        ),
      ]);

      const dressedUpImage = result;
      const newDressUp = new DressUpModel({
        user: userId,
        clothingItem: clothingItem._id,
        dressedUpImage: result,
        timestamp: new Date(),
      });
      await newDressUp.save();

      clothingItem.usageCount = (clothingItem?.usageCount || 0) + 1;
      await clothingItem.save();

      return NextResponse.json(
        { message: "Dressed Up successfully", result: dressedUpImage },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error(error, '>?>>>>>>');
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
