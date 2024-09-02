import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/DataBase/dbConnect";
import { verifyToken } from "@/middle/verifyToken";
import { ObjectId } from "mongodb";
import UserModel from "@/models/UserModel";
import SubscriptionModel from "@/models/SubscriptionModel";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json({ reply: "Unauthorized" }, { status: 401 });
    }

    const user = await UserModel.findOne({
      _id: new ObjectId(userId),
    }).populate("subscriptions");
    if (!user) {
      return NextResponse.json({ reply: "User not found" }, { status: 404 });
    }

    const subscriptionByUser = await SubscriptionModel.findOne({
      userId: new ObjectId(userId),
    });
    if (!user) {
      return NextResponse.json({ reply: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      userDetail: user,
      subscriptionDetail: subscriptionByUser,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json({ reply: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { plan, creditLimit, usedCredit } = body;

    if (!plan) {
      return NextResponse.json(
        { reply: "Plan type is required" },
        { status: 400 }
      );
    }

    // Update or create the subscription
    const updatedSubscription = await SubscriptionModel.findOneAndUpdate(
      { userId: new ObjectId(userId) },
      { plan, creditLimit, usedCredit },
      { new: true, upsert: true }
    );

    // Optionally update the user's subscription reference
    await UserModel.findByIdAndUpdate(
      userId,
      { subscription: updatedSubscription._id },
      { new: true }
    );

    return NextResponse.json(
      {
        message: "Subscription updated successfully",
        subscription: updatedSubscription,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}
