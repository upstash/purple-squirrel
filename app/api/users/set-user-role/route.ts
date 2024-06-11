import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server"
import type { NextRequest } from 'next/server';


export async function POST(req: NextRequest) {
    const data = await req.json();
    if (!(data?.id && data?.role)) {
        return Response.error();
    }
    const id = data.id;
    const role = data.role;

    const { sessionClaims, userId } = auth()

    const authRole = sessionClaims?.metadata?.role;

    if (!authRole || (authRole !== "admin")) {
        return Response.json({status: 401, message: "Not Authorized" });
    }
    
      try {
        const res = await clerkClient.users.updateUser(
          id,
          {
            publicMetadata: (role === "user" ? {} : { role: role }),
          }
        );
        return Response.json({status: 200, message: "Success" });
      } catch (err) {
        return Response.json({status: 500, message: err });
      }
}

export const dynamic = "force-dynamic";