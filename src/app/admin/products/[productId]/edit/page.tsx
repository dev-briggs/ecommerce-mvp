import db from "@/db";
import { PageHeader } from "../../../../../features/admin/components/PageHeader";
import ProductForm from "../../_components/ProductForm";

export default async function EditProductPage({
  params: { productId },
}: {
  params: { productId: string };
}) {
  const product = await db.product.findUnique({ where: { id: productId } });
  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} />
    </>
  );
}
