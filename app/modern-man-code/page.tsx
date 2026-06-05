import type { Metadata } from "next";
import SalesPage from "@/components/SalesPage";

export const metadata: Metadata = {
  title: "The Modern Man Code | UNVEIL",
  description: "A premium digital guide to body literacy, emotional intelligence, hygiene, and refined masculine self-care.",
};

export default function ModernManCodePage() {
  return <SalesPage slug="the-modern-man-code" />;
}
