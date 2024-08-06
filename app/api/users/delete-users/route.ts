import { auth, clerkClient } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data?.ids) {
    return Response.error();
  }
  const ids = data.ids;

  const { sessionClaims } = auth();

  const authRole = sessionClaims?.metadata?.role;

  if (!authRole || authRole !== "admin") {
    return Response.json({ status: 401, message: "Not Authorized" });
  }

  try {
    await Promise.all(
      ids.map(async (id: any) => {
        const res = await clerkClient.users.deleteUser(id);
      })
    );
    return Response.json({ status: 200, message: "Success" });
  } catch (err) {
    return Response.json({ status: 500, message: err });
  }
}
