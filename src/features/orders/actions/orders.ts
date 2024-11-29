"use server";

import db from "@/db";
import { notFound } from "next/navigation";

export async function userOrderExists(email: string, productId: string) {
  return !!(await db.order.findFirst({
    where: { user: { email }, productId },
    select: { id: true },
  }));
}

export async function deleteOrder(id: string) {
  const user = await db.order.delete({ where: { id } });
  if (!user) return notFound();

  return user;
}
