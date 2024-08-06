"use client";

import { AdminManager } from "@/app/managers";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <AdminManager>{children}</AdminManager>
    </section>
  );
}
