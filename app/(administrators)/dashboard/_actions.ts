"use server";

import { checkRole } from "@/app/utils/roles";
import { Roles } from "@/types/globals";
import { clerkClient } from "@clerk/nextjs/server";

export async function setRole(id: string, role: Roles) {
  if (!checkRole("admin")) {
    return { message: "Not Authorized" };
  }

  try {
    const res = await clerkClient.users.updateUser(id, {
      publicMetadata: { role: role },
    });
    return { message: res.publicMetadata };
  } catch (err) {
    return { message: err };
  }
}
