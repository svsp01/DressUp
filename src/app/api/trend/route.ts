import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/DataBase/dbConnect";
import { verifyToken } from "@/middle/verifyToken";
import TrendingItem from "@/models/TrendingItem";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json({ reply: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    const skip = (page - 1) * limit;

    const AllData = await TrendingItem.find({
      $and: [
        { reporters: { $not: { $elemMatch: { userId: userId } } } },
        { deletedBy: { $nin: [userId] } },
      ],
    })
      .skip(skip)
      .limit(limit);

    const hasMore = AllData.length === limit;

    if (AllData.length === 0) {
      return NextResponse.json(
        { result: { data: [], hasMore: false } },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        result: { data: AllData, hasMore },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { reply: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const {
      secretKey,
      title,
      description,
      image,
      category,
      type,
      color,
      season,
      width,
      height,
    } = await request.json();

    console.log("Received secretKey:", secretKey);
    console.log("Environment secretKey:", process.env.SECRET_KEY);

    if (secretKey !== process.env.SECRET_KEY) {
      console.log("Unauthorized: secretKey does not match.");
      return NextResponse.json({ reply: "Unauthorized" }, { status: 401 });
    }

    if (
      !title ||
      !description ||
      !image ||
      !category ||
      !type ||
      !color ||
      !season
    ) {
      console.log("Missing required fields");
      return NextResponse.json(
        { reply: "Missing required fields" },
        { status: 400 }
      );
    }

    const newItem = new TrendingItem({
      title,
      description,
      image,
      category,
      type,
      color,
      season,
      width,
      height,
    });

    await newItem.save();

    return NextResponse.json(
      { result: "Item added successfully", item: newItem },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ reply: "Failed to add item" }, { status: 500 });
  }
}
