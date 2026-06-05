import type { Metadata } from "next";
import SalesPage from "@/components/SalesPage";

export const metadata: Metadata = {
  title: "The Art of Connection | UNVEIL",
  description: "A concise digital guide to presence, communication, confidence, and emotionally intelligent dating.",
};

export default function TheArtOfConnectionPage() {
  return <SalesPage slug="the-art-of-connection" />;
}
