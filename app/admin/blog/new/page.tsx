import { AdminHeader } from "@/components/admin/AdminListTools";
import BlogForm from "@/components/admin/BlogForm";

export default function NewBlogPage() {
  return (
    <div>
      <AdminHeader eyebrow="Editorial" title="New article" />
      <BlogForm />
    </div>
  );
}

