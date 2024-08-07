import { clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  const res = await clerkClient.users.getUserList({
    orderBy: '-created_at',
    limit: 100,
  });
  const users = res.data;
  return Response.json({ status: 200, users: users });
}

export const dynamic = "force-dynamic";
