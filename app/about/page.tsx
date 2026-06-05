import type { Metadata } from "next";
import AboutExperience from "@/components/AboutExperience";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about UNVEIL's mission to provide discreet, premium education for men's intimate health, hygiene, body literacy, and self-care.",
  openGraph: {
    title: "About UNVEIL",
    description:
      "UNVEIL is an education-first wellness platform for men's hygiene, body literacy, emotional intelligence, and modern self-care.",
  },
};

export default function AboutPage() {
  return <AboutExperience />;
}

