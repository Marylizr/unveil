type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

const RESEND_API_URL = "https://api.resend.com/emails";

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || "http://localhost:3000";
}

function isProductionEmailRuntime() {
  return process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
}

function isEmailExplicitlyDisabled() {
  return [process.env.DISABLE_EMAIL, process.env.DISABLE_EMAILS].some((value) =>
    ["1", "true", "yes"].includes(String(value || "").toLowerCase())
  );
}

export async function sendEmail({ to, subject, html, text }: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const configuredFrom = process.env.RESEND_FROM_EMAIL;
  const from = configuredFrom || "UNVEIL <hello@unveil.co>";
  const isProduction = isProductionEmailRuntime();

  if (isEmailExplicitlyDisabled()) {
    if (isProduction) {
      throw new Error("Email delivery cannot be disabled in production");
    }
    console.info(`[email disabled] ${subject} -> ${to}`);
    return { skipped: true, reason: "disabled" };
  }

  if (!apiKey) {
    if (isProduction) {
      throw new Error("RESEND_API_KEY is required for production email delivery");
    }
    console.info(`[email disabled] ${subject} -> ${to}`);
    return { skipped: true, reason: "missing_api_key" };
  }

  if (!configuredFrom && isProduction) {
    throw new Error("RESEND_FROM_EMAIL is required for production email delivery");
  }

  if (!isProduction || process.env.EMAIL_DEBUG === "true") {
    console.info(`[email send] ${subject} -> ${to}`);
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html, text }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend email failed: ${response.status} ${error}`);
  }

  return response.json();
}

