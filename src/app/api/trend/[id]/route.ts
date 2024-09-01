import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/DataBase/dbConnect";
import { verifyToken } from "@/middle/verifyToken";
import TrendingItem from "@/models/TrendingItem";
import { ObjectId } from "mongodb";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      await dbConnect();
  
      const userId = await verifyToken(request);
      if (!userId) {
        return NextResponse.json({ reply: "Unauthorized" }, { status: 401 });
      }
  
      const { id } = params;
  
      const updatedItem = await TrendingItem.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $addToSet: { deletedBy: userId } }, 
        { new: true }
      );
  
      if (!updatedItem) {
        return NextResponse.json({ reply: "Item not found or already deleted" }, { status: 404 });
      }
  
      return NextResponse.json({ result: "Clothing item deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json({ reply: "Failed to delete clothing item" }, { status: 500 });
    }
  }
  

  export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      await dbConnect();
  
      const userId = await verifyToken(request);
      if (!userId) {
        return NextResponse.json({ reply: "Unauthorized" }, { status: 401 });
      }
  
      const { id } = params;
      const { feedback } = await request.json();
  
      if (!feedback) {
        return NextResponse.json({ reply: "Feedback is required" }, { status: 400 });
      }
  
      const item = await TrendingItem.findById(id);
      if (!item) {
        return NextResponse.json({ reply: "Item not found" }, { status: 404 });
      }
  
      if (item.reporters.includes(userId)) {
        return NextResponse.json({ reply: "Item already reported by this user" }, { status: 400 });
      }
  
      item.reporters.push(userId);
      item.reports = item.reports || [];
      item.reports.push({ userId, feedback });
  
      await item.save();
  
      return NextResponse.json({ result: "Item reported successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json({ reply: "Failed to report item" }, { status: 500 });
    }
  }
  