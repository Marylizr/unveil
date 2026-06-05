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

export async function sendEmail({ to, subject, html, text }: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "UNVEIL <hello@unveil.co>";

  if (!apiKey) {
    console.info(`[email disabled] ${subject} -> ${to}`);
    return { skipped: true };
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

