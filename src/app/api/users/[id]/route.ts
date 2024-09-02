import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/DataBase/dbConnect";
import { verifyToken } from "@/middle/verifyToken";
import { ObjectId } from "mongodb";
import UserModel from "@/models/UserModel";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json({ reply: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const updateData = await request.json();

    const updatedItem = await UserModel.findOneAndUpdate(
      { _id: new ObjectId(id) },
      updateData,
    );

    if (!updatedItem) {
      return NextResponse.json(
        { reply: "Item not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { result: "Clothing item updated successfully", data: updatedItem },
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
