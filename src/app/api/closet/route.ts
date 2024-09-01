import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/DataBase/dbConnect";
import { verifyToken } from "@/middle/verifyToken";
import ClothingItem from "@/models/ClothingItem";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json({ reply: "Unauthorized" }, { status: 401 });
    }

    const { title, description, image, category, type, color, season } =
      await request.json();

    if (
      !title ||
      !description ||
      !image ||
      !category ||
      !type ||
      !color ||
      !season
    ) {
      return NextResponse.json(
        { reply: "All fields are required" },
        { status: 400 }
      );
    }

    const newClothingItem = new ClothingItem({
      userId,
      title,
      description,
      image,
      category,
      type,
      color,
      season,
    });

    await newClothingItem.save();

    return NextResponse.json(
      { result: "Clothing item saved successfully" },
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


export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json({ reply: "Unauthorized" }, { status: 401 });
    }

    const AllData = await ClothingItem.find({ userId: userId });

    if (!AllData) {
      return NextResponse.json(
        { reply: "Item not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { result: "Clothing item updated successfully", data: AllData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { reply: "Failed to update clothing item" },
      { status: 500 }
    );
  }
}

