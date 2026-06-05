export interface Lead {
  _id: string;
  email: string;
  firstName?: string;
  country?: string;
  interests: string[];
  source: string;
  requestedLeadMagnetSlug?: string;
  language: string;
  consent: boolean;
  consentedAt: string;
  consentIp?: string;
  consentUserAgent?: string;
  consentText?: string;
  consentVersion?: string;
  privacyPolicyUrl?: string;
  status: "pending" | "confirmed";
  emailConfirmedAt?: string;
  unsubscribedAt?: string;
  welcomeSequenceStatus?: "not_started" | "active" | "completed";
  welcomeEmailSentAt?: string;
  emailSequenceStep?: number;
  emailSequenceNextSendAt?: string;
  emailSequenceCompletedAt?: string;
  emailSequenceEvents?: Array<{
    step: number;
    sentAt?: string;
    openedAt?: string;
    clickedAt?: string;
    completedAt?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalBlogArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalProducts: number;
  publishedProducts: number;
  totalLeads: number;
  confirmedLeads: number;
  leadMagnets: number;
}

export interface AdminOrder {
  _id: string;
  customerEmail: string;
  customerName?: string;
  productIds: string[];
  lineItems: Array<{
    productId: string;
    title: string;
    quantity: number;
    unitAmount: number;
    currency: string;
  }>;
  totalAmount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded" | "canceled";
  paymentProvider: "stripe" | "manual" | "test";
  createdAt: string;
  paidAt?: string;
  refundedAt?: string;
}

export interface AdminEntitlement {
  _id: string;
  customerEmail: string;
  userEmail?: string;
  productId: string | { _id: string; title?: { en: string }; slug?: string };
  orderId?: string;
  accessType: "download" | "course" | "membership";
  status: "active" | "revoked" | "expired";
  expiresAt?: string;
  downloadCount: number;
  lastDownloadedAt?: string;
  createdAt: string;
}
