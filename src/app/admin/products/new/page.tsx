import { PageHeader } from "../../../../features/admin/components/PageHeader";
import ProductForm from "../../../../features/products/components/ProductForm";

export default function NewProductPage() {
  return (
    <>
      <PageHeader>Add Product</PageHeader>
      <ProductForm />
    </>
  );
}
