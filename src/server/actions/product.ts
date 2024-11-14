"use server";

import { z } from "zod";
import { addProductSchema } from "@/schema/products";
import db from "@/db";
import fs from "fs/promises";
import { redirect } from "next/navigation";

export type AddProductError = z.ZodError<typeof addProductSchema>

export async function addProduct(
  unsafeData: z.infer<typeof addProductSchema>
): Promise<{ error: AddProductError } | undefined> {
  const {
    success,
    data: safeData,
    error,
  } = addProductSchema.safeParse(unsafeData);
  if (!success) return { error };

  const filePath = `products/${crypto.randomUUID()}-${safeData.file.name}`;
  const imagePath = `products/${crypto.randomUUID()}-${safeData.image.name}`;

  await Promise.all([
    await fs.mkdir("products", { recursive: true }),
    await fs.writeFile(
      filePath,
      Buffer.from(await safeData.file.arrayBuffer())
    ),
    await fs.mkdir("public/products", { recursive: true }),
    await fs.writeFile(
      `public/${imagePath}`,
      Buffer.from(await safeData.image.arrayBuffer())
    ),
    await db.product.create({
      data: {
        isAvailableForPurchase: false,
        name: safeData.name,
        description: safeData.description,
        priceInCents: safeData.priceInCents,
        filePath,
        imagePath,
      },
    }),
  ]);

  console.log("filePath: ", filePath)
  console.log("imagePath: ", imagePath)

  redirect("/admin/products");
}
