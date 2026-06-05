import { AdminHeader } from "@/components/admin/AdminListTools";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <AdminHeader eyebrow="Catalog" title="New product" />
      <ProductForm />
    </div>
  );
}

