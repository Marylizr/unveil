import type { Metadata } from "next";
import LearnExperience from "@/components/blog/LearnExperience";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Read UNVEIL's premium men's health journal on intimate hygiene, body literacy, emotional intelligence, communication, and modern self-care.",
  openGraph: {
    title: "UNVEIL Journal",
    description:
      "A calm educational journal for men's hygiene, body literacy, emotional intelligence, and responsible wellbeing.",
  },
};

export default function LearnPage() {
  return <LearnExperience />;
}

