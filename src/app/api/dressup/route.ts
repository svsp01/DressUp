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

// export async function POST(request: NextRequest) {
//   try {
//     await dbConnect();

//     // Verify token and get user ID
//     const userId = await verifyToken(request);
//     if (!userId) {
//       return NextResponse.json({ reply: "Unauthorized" }, { status: 401 });
//     }

//     const body = await request.json();

//     if (body) {
//       const { humanImage, dressImage, clothingItemId } = body;
//       if (!isValidObjectId(clothingItemId)) {
//         return NextResponse.json(
//           { reply: "Invalid ID format" },
//           { status: 400 }
//         );
//       }
//       // Fetch the clothing item from the database
//       const clothingItem = await ClothingItemModel.findById(clothingItemId);

//       if (!clothingItem) {
//         return NextResponse.json(
//           { error: "Clothing Item not found" },
//           { status: 404 }
//         );
//       }

//       const client = await Client.connect("Kwai-Kolors/Kolors-Virtual-Try-On");

//       const humanBlob = base64ToBlob(humanImage);
//       const dressBlob = base64ToBlob(dressImage);

//       const result: any = await Promise.race([
//         client.predict("/tryon", {
//           person_img: humanBlob,
//           garment_img: dressBlob,
//           seed: 0,
//           randomize_seed: true,
//         }),
//         new Promise((_, reject) =>
//           setTimeout(() => reject(new Error("Request timed out")), 12000000)
//         ),
//       ]);

//       const dressedUpImage = result;
//       const newDressUp = new DressUpModel({
//         user: userId,
//         clothingItem: clothingItem._id,
//         dressedUpImage: result,
//         timestamp: new Date(),
//       });
//       await newDressUp.save();

//       clothingItem.usageCount = (clothingItem?.usageCount || 0) + 1;
//       await clothingItem.save();

//       return NextResponse.json(
//         { message: "Dressed Up successfully", result: dressedUpImage },
//         { status: 201 }
//       );
//     }
//   } catch (error: any) {
//     console.error(error, ">?>>>>>>");
//     return NextResponse.json({ error: error }, { status: 500 });
//   }
// }

export async function POST(request: NextRequest) {
  try {
    // Step 1: Database Connection
    try {
      await dbConnect();
    } catch (error) {
      console.error("Database connection failed:", error);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    // Step 2: Verify token and get user ID
    let userId;
    try {
      userId = await verifyToken(request);
      if (!userId) {
        return NextResponse.json({ reply: "Unauthorized" }, { status: 401 });
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.json(
        { error: "Token verification failed" },
        { status: 401 }
      );
    }

    // Step 3: Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Failed to parse request body:", error);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    if (body) {
      const { humanImage, dressImage, clothingItemId } = body;

      if (!isValidObjectId(clothingItemId)) {
        return NextResponse.json(
          { reply: "Invalid ID format" },
          { status: 400 }
        );
      }

      let clothingItem;
      try {
        clothingItem = await ClothingItemModel.findById(clothingItemId);
        if (!clothingItem) {
          return NextResponse.json(
            { error: "Clothing Item not found" },
            { status: 404 }
          );
        }
      } catch (error) {
        console.error("Failed to fetch clothing item:", error);
        return NextResponse.json(
          { error: "Failed to fetch clothing item" },
          { status: 500 }
        );
      }

      let client;
      try {
        client = await Client.connect("Kwai-Kolors/Kolors-Virtual-Try-On");
      } catch (error) {
        console.error("Failed to connect to external service:", error);
        return NextResponse.json(
          { error: "External service connection failed" },
          { status: 500 }
        );
      }

      let humanBlob, dressBlob;
      try {
        humanBlob = base64ToBlob(humanImage);
        dressBlob = base64ToBlob(dressImage);
      } catch (error) {
        console.error("Failed to convert images:", error);
        return NextResponse.json(
          { error: "Image conversion failed" },
          { status: 400 }
        );
      }

      let dressedUpImage;
      try {
        dressedUpImage = await Promise.race([
          client.predict("/tryon", {
            person_img: humanBlob,
            garment_img: dressBlob,
            seed: 0,
            randomize_seed: true,
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timed out")), 12000000)
          ),
        ]);
      } catch (error) {
        if (error) {
          console.error("Prediction request failed with response:", error);
        }
        return NextResponse.json(
          { error: "Prediction request failed", details: error },
          { status: 500 }
        );
      }

      try {
        const newDressUp = new DressUpModel({
          user: userId,
          clothingItem: clothingItem._id,
          dressedUpImage: dressedUpImage,
          timestamp: new Date(),
        });
        await newDressUp.save();
      } catch (error) {
        console.error("Failed to save dressed up image:", error);
        return NextResponse.json(
          { error: "Failed to save dressed up image" },
          { status: 500 }
        );
      }

      try {
        clothingItem.usageCount = (clothingItem?.usageCount || 0) + 1;
        await clothingItem.save();
      } catch (error) {
        console.error("Failed to update clothing item usage count:", error);
        return NextResponse.json(
          { error: "Failed to update clothing item" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "Dressed Up successfully", result: dressedUpImage },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: "Request body is empty" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Unexpected error occurred:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
