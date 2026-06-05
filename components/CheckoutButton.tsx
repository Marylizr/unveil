"use client";

import { useState } from "react";

export default function CheckoutButton({ productSlug }: { productSlug: string }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function startCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          customerEmail: email,
          customerName: name,
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.checkoutUrl) {
        setMessage(payload.error || "Checkout is not available yet.");
        return;
      }

      window.location.href = payload.checkoutUrl;
    } catch {
      setMessage("Checkout is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={startCheckout} className="grid gap-3">
      <label className="sr-only" htmlFor={`checkout-name-${productSlug}`}>Name</label>
      <input
        id={`checkout-name-${productSlug}`}
        value={name}
        onChange={(event) => setName(event.target.value)}
        autoComplete="name"
        placeholder="Name optional"
        className="min-h-[48px] rounded-full border border-[#E8E8E2]/25 bg-transparent px-5 font-sans text-sm text-[#E8E8E2] placeholder-[#E8E8E2]/50 outline-none transition focus:border-gold"
      />
      <label className="sr-only" htmlFor={`checkout-email-${productSlug}`}>Email</label>
      <input
        id={`checkout-email-${productSlug}`}
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        placeholder="Email for delivery"
        className="min-h-[48px] rounded-full border border-[#E8E8E2]/25 bg-transparent px-5 font-sans text-sm text-[#E8E8E2] placeholder-[#E8E8E2]/50 outline-none transition focus:border-gold"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-[#E8E8E2] px-7 py-4 font-sans text-xs uppercase tracking-widest text-deep transition hover:bg-[#F4F1E8] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Opening checkout..." : "Get instant access"}
      </button>
      {message && <p className="font-sans text-xs leading-relaxed text-[rgba(232,232,226,0.72)]">{message}</p>}
    </form>
  );
}
