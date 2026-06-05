interface BrandLogoProps {
  variant?: "dark" | "white";
  context?: "nav" | "footer" | "admin";
}

const sizeClasses = {
  nav: "h-10 w-32",
  footer: "h-16 w-48",
  admin: "h-10 w-36",
};

export default function BrandLogo({ variant = "white", context = "nav" }: BrandLogoProps) {
  const logo = variant === "white" ? "/brand/unveil-logo-white.png" : "/brand/unveil-logo-dark.png";

  return (
    <span className={`relative block overflow-hidden ${sizeClasses[context]}`} aria-label="UNVEIL">
      <img
        src={logo}
        alt="UNVEIL"
        className="h-full w-full object-contain"
      />
    </span>
  );
}
