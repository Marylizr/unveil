"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/translations";

const langs: Language[] = ["en", "pt", "es"];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1">
      {langs.map((lang, i) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          aria-label={`Switch language to ${lang.toUpperCase()}`}
          aria-pressed={language === lang}
          className={`font-sans text-xs uppercase tracking-wider px-1.5 py-0.5 transition-colors ${
            language === lang ? "text-mist" : "text-sage hover:text-cream"
          }`}
        >
          {lang}
          {i < langs.length - 1 && <span className="ml-1.5 text-forest">|</span>}
        </button>
      ))}
    </div>
  );
}
