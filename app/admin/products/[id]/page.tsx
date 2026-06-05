"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminListTools";
import { useAdminToken } from "@/components/admin/AdminAuthGate";
import ProductForm from "@/components/admin/ProductForm";
import { adminApi } from "@/lib/admin/adminApi";
import type { Product } from "@/types/content";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { token } = useAdminToken();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    adminApi.products.get(token, params.id).then(setProduct).catch(() => setProduct(null));
  }, [token, params.id]);

  return (
    <div>
      <AdminHeader eyebrow="Catalog" title={product ? product.title.en : "Loading product"} />
      {product && <ProductForm product={product} />}
    </div>
  );
}

