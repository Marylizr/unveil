import type { Metadata } from "next";
import SalesPage from "@/components/SalesPage";

export const metadata: Metadata = {
  title: "Understanding Female Pleasure | UNVEIL",
  description: "A refined educational guide to communication, anatomy literacy, emotional safety, and attentive intimacy.",
};

export default function UnderstandingFemalePleasurePage() {
  return <SalesPage slug="understanding-female-pleasure" />;
}
