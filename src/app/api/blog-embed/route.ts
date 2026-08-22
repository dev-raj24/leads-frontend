// Public proxy for public/blog.js — the embed script running on a tenant's
// own website. Forwards to the real backend's published-posts endpoint.
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const siteKey = searchParams.get("siteKey");

  if (!siteKey) {
    const res = NextResponse.json({ error: "missing_site_key" }, { status: 400 });
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${API_URL}/api/public/blog?siteKey=${encodeURIComponent(siteKey)}`);
  } catch {
    const res = NextResponse.json({ error: "backend_unreachable" }, { status: 502 });
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  }

  const data = await upstream.json().catch(() => ({}));
  const res = NextResponse.json(data, { status: upstream.status });
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
