"use client";

interface FilterOption {
  label: string;
  value: string;
}

interface CategoryFilterProps {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  tone?: "dark" | "light";
}

export default function CategoryFilter({ label, options, value, onChange, tone = "dark" }: CategoryFilterProps) {
  const light = tone === "light";

  return (
    <fieldset className="border-0">
      <legend className={`mb-3 font-sans text-[10px] uppercase tracking-[0.3em] ${light ? "text-[#5F6648]" : "text-sage/60"}`}>{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={`rounded-full border px-4 py-2 font-sans text-xs uppercase tracking-widest transition-all ${
              value === option.value
                ? light
                  ? "border-gold bg-gold/10 text-deep"
                  : "border-mist bg-mist/10 text-mist"
                : light
                  ? "border-[rgba(77,80,57,0.2)] text-[#5F6648] hover:border-gold hover:text-deep"
                  : "border-forest/50 text-sage hover:border-sage hover:text-cream"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
