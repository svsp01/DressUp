import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import AIGenerationsModel from "@/models/AIGenerationsModel";
import UserModel from "@/models/UserModel";
import { ObjectId } from "mongodb";
import dbConnect from "@/DataBase/dbConnect";
import { verifyToken } from "@/middle/verifyToken";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json({ reply: "Unauthorized" }, { status: 401 });
    }

    const user = await UserModel.findById(new ObjectId(userId));
    if (!user) {
      return NextResponse.json({ reply: "User not found" }, { status: 404 });
    }

    const aiGenerations = await AIGenerationsModel.find({
      user: new ObjectId(userId),
    });

    return NextResponse.json({ aiGenerations }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch AI generations" },
      { status: 500 }
    );
  }
}
