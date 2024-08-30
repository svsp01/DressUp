import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function verifyToken(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get('token');

  if (!token) {
    return null; 
  }

  try {
    const decoded: any = jwt.verify(token.value, `${process.env.JWT_SECRET}` as string);
    return decoded?.userId || null; 
  } catch (err) {
    return null; 
  }
}
