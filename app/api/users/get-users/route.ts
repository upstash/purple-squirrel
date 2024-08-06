import { clerkClient } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data?.query) {
    return Response.error();
  }
  const query = data.query;
  const res = await clerkClient.users.getUserList({ query });
  const users = res.data;
  return Response.json({ status: 200, users: users });
}

export const dynamic = "force-dynamic";
