import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin/session";

export const runtime = "nodejs";

type ProxyContext = {
  params: {
    path: string[];
  };
};

function getBackendOrigin(request: NextRequest) {
  const configured =
    process.env.API_INTERNAL_URL ||
    process.env.API_BASE_URL ||
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3002";
  const currentOrigin = new URL(request.url).origin;
  const backendOrigin = new URL(configured).origin;

  if (backendOrigin === currentOrigin) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[admin-api-proxy] Backend origin matched frontend origin; falling back to http://localhost:3002");
    }
    return "http://localhost:3002";
  }

  return backendOrigin;
}

function logProxyResult(path: string, method: string, status: number, backendOrigin: string) {
  if (process.env.NODE_ENV === "production") return;
  console.info("[admin-api-proxy]", {
    method,
    path: `/api/${path}`,
    status,
    backendOrigin,
  });
}

async function proxyAdminRequest(request: NextRequest, context: ProxyContext) {
  const session = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  const adminToken = process.env.ADMIN_API_TOKEN;

  if (!verifyAdminSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!adminToken) {
    return NextResponse.json({ error: "Admin API token is not configured" }, { status: 503 });
  }

  const path = context.params.path.join("/");
  const search = request.nextUrl.search || "";
  const body = request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer();
  const backendOrigin = getBackendOrigin(request);
  const targetUrl = new URL(`/api/${path}${search}`, backendOrigin);

  const headers = new Headers();
  headers.set("Accept", request.headers.get("accept") || "application/json");
  headers.set("x-admin-token", adminToken);

  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  let response: Response;
  try {
    response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[admin-api-proxy] Backend request failed", {
        method: request.method,
        path: `/api/${path}`,
        backendOrigin,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    return NextResponse.json(
      { error: "Admin API backend is unavailable" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }

  logProxyResult(path, request.method, response.status, backendOrigin);

  const responseText = await response.text();
  const responseContentType = response.headers.get("content-type") || "application/json";

  return new NextResponse(responseText || null, {
    status: response.status,
    headers: {
      "Content-Type": responseContentType,
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(request: NextRequest, context: ProxyContext) {
  return proxyAdminRequest(request, context);
}

export async function POST(request: NextRequest, context: ProxyContext) {
  return proxyAdminRequest(request, context);
}

export async function PUT(request: NextRequest, context: ProxyContext) {
  return proxyAdminRequest(request, context);
}

export async function PATCH(request: NextRequest, context: ProxyContext) {
  return proxyAdminRequest(request, context);
}

export async function DELETE(request: NextRequest, context: ProxyContext) {
  return proxyAdminRequest(request, context);
}
