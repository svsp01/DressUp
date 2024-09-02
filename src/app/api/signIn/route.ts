import dbConnect from "@/DataBase/dbConnect";
import UserModel from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import SubscriptionModel from "@/models/SubscriptionModel";

export async function GET() {
  try {
    await dbConnect();
    const data = await UserModel.find({});
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    if (body.username) {
      const {
        username,
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        profileImageUrl,
        monthlyIncome,
        bio,
        skills,
        interests,
      } = body;

      // Check for existing user
      const existingUser = await UserModel.findOne({ email });

      if (existingUser) {
        return NextResponse.json(
          { message: "User already exists" },
          { status: 400 }
        );
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Split and clean up skills and interests
      const cleanedSkills = skills
        ? skills
            .split(",")
            .map((skill: string) => skill.trim())
            .filter((skill: string) => skill)
        : [];
      const cleanedInterests = interests
        ? interests
            .split(",")
            .map((interest: string) => interest.trim())
            .filter((interest: string) => interest)
        : [];

      // Create new user
      const newUser = {
        username,
        email,
        firstName,
        lastName,
        password: hashedPassword,
        phoneNumber,
        monthlyIncome,
        profileImageUrl,
        bio,
        createdAt: new Date(),
        lastLogin: new Date(),
        skills: cleanedSkills,
        interests: cleanedInterests,
      };

      const userResult = await UserModel.create(newUser);

      const subscription = {
        userId: userResult._id,
        plan: "free", 
        creditLimit: 100, 
        usedCredit: 0,
      };

      await SubscriptionModel.create(subscription);

      return NextResponse.json(
        {
          message: "User and subscription created successfully",
          userId: userResult._id,
        },
        { status: 201 }
      );
    } else {
      const { email, password } = body;
      const user = await UserModel.findOne({ email });

      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 400 }
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Invalid password" },
          { status: 400 }
        );
      }

      const token = sign(
        { userId: user._id, email: user.email, username: user.username },
        `${process.env.JWT_SECRET}`,
        {
          expiresIn: "1h",
        }
      );

      const response = NextResponse.json({
        message: "Login successful",
        data: {
          userId: user._id,
          profileImageUrl: user.profileImageUrl,
          monthlyIncome: user.monthlyIncome,
          email: user.email,
          username: user.username,
          token: token,
        },
      });

      response.cookies.set("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      });

      return response;
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
