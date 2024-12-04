"use server";

import db from "@/db";
import OrderHistoryEmail from "@/features/email/OrderHistory";
import { ordersSchema } from "@/schema/orders";
import { notFound } from "next/navigation";
import { Resend } from "resend";
import { z } from "zod";

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

const EMAIL_ORDER_HISTORY_MESSAGES = {
  INVALID_SUCCESS:
    "Check your email to view your order history and download your products.",
  RESEND_ERROR: "There was an error sending your email. Please try again.",
};
const resend = new Resend(process.env.RESEND_API_KEY);
export async function emailOrderHistory(
  formData: z.infer<typeof ordersSchema>
): Promise<{ message?: string; error?: string }> {
  const { success, data, error } = ordersSchema.safeParse(formData);
  if (!success) return { error: error.message };

  const user = await db.user.findUnique({
    where: { email: data.email },
    select: {
      email: true,
      orders: {
        select: {
          pricePaidInCents: true,
          id: true,
          createdAt: true,
          product: {
            select: {
              id: true,
              name: true,
              imagePath: true,
              description: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return {
      message: EMAIL_ORDER_HISTORY_MESSAGES.INVALID_SUCCESS,
    };
  }

  const orders = await Promise.all(
    user.orders.map(async (order) => ({
      ...order,
      downloadVerificationId: (
        await db.downloadVerification.create({
          data: {
            expiresAt: new Date(Date.now() + 24 * 1000 * 60 * 60),
            productId: order.product.id,
          },
        })
      ).id,
    }))
  );

  const resendData = await resend.emails.send({
    from: `Support <${process.env.SENDER_EMAIL}>`,
    to: user.email,
    subject: "Order History",
    react: <OrderHistoryEmail orders={orders} />,
  });

  if (resendData.error) {
    return {
      error: EMAIL_ORDER_HISTORY_MESSAGES.RESEND_ERROR,
    };
  }
  return { message: EMAIL_ORDER_HISTORY_MESSAGES.INVALID_SUCCESS };
}
