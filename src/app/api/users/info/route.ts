// src/app/api/users/info/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const { userIds } = await req.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: 'Valid user IDs are required' }, { status: 400 });
    }

    // Fetch users from Clerk
    const users = await clerkClient.users.get qq({
      userId: userIds,
    });

    // Transform the data to match the expected structure in the component
    const userMap: Record<string, {
      id: string;
      firstName: string | null;
      lastName: string | null;
      fullName: string | null;
      imageUrl: string | null;
    }> = {};

    users.forEach(user => {
      userMap[user.id] = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || user.lastName,
        imageUrl: user.imageUrl,
      };
    });

    return NextResponse.json(userMap);
  } catch (error) {
    console.error('Error fetching user info:', error);
    return NextResponse.json({ error: 'Failed to fetch user information' }, { status: 500 });
  }
}
