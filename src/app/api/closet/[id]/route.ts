import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/DataBase/dbConnect";
import { verifyToken } from "@/middle/verifyToken";
import ClothingItem from "@/models/ClothingItem";
import { ObjectId } from "mongodb";

export async function DELETE(
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

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ reply: "Invalid ID format" }, { status: 400 });
    }

    const deletedItem = await ClothingItem.findOneAndDelete({
      _id: new ObjectId(id),
      userId,
    });

    if (!deletedItem) {
      return NextResponse.json(
        { reply: "Item not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { result: "Clothing item removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { reply: "Failed to remove clothing item" },
      { status: 500 }
    );
  }
}

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

    const updatedItem = await ClothingItem.findOneAndUpdate(
      { _id: new ObjectId(id), userId },
      updateData,
      { new: true }
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
