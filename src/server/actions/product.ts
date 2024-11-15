"use server";

import { z } from "zod";
import { addProductSchema } from "@/schema/products";
import db from "@/db";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";

export type AddProductError = z.ZodError<typeof addProductSchema>;

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

  redirect("/admin/products");
}

export async function toggleProductAvailability(
  id: string,
  isAvailableForPurchase: boolean
) {
  const product = await db.product.update({
    where: { id },
    data: { isAvailableForPurchase },
  });
  return product;
}

export async function deleteProduct(id: string) {
  const product = await db.product.delete({ where: { id } });
  if (!product) return notFound();

  await fs.unlink(product.filePath);
  await fs.unlink(`public/product.ts${product.imagePath}`);
}
