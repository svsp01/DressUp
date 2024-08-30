import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/DataBase/dbConnect';
import UserModel from '@/models/UserModel';

export async function authenticate(request: NextRequest) {
  const token = request.cookies.get('token');

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'No token provided' },
      { status: 401 }
    );
  }

  let userId: string;
  try {
    const decoded: any = jwt.verify(token.value, `${process.env.JWT_SECRET}` as string);
    userId = decoded.userId;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to authenticate token' },
      { status: 401 }
    );
  }

  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'User ID is required' },
      { status: 400 }
    );
  }

  await dbConnect();

  const user = await UserModel.findById(userId);
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'User not found' },
      { status: 404 }
    );
  }

  return { userId, user };
}
