import { Suspense } from "react";
import BrandLogo from "@/components/BrandLogo";
import AdminLoginForm from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-deep px-6 py-24 text-cream">
      <div className="mx-auto max-w-md border border-forest/50 bg-forest/20 p-8">
        <div className="mb-8">
          <BrandLogo variant="white" context="admin" />
        </div>
        <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-mist/80">Internal CMS</p>
        <h1 className="font-serif text-5xl leading-tight text-cream">Admin login</h1>
        <p className="mt-4 font-sans text-sm leading-relaxed text-sage/80">
          Sign in to manage UNVEIL content, resources, and leads.
        </p>

        <Suspense fallback={null}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </main>
  );
}
