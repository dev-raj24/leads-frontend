// Public proxy for public/blog.js — fetches a single published post by slug.
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

export async function GET(req: Request, props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const { searchParams } = new URL(req.url);
  const siteKey = searchParams.get("siteKey");

  if (!siteKey) {
    const res = NextResponse.json({ error: "missing_site_key" }, { status: 400 });
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  }

  let upstream: Response;
  try {
    upstream = await fetch(
      `${API_URL}/api/public/blog/${encodeURIComponent(slug)}?siteKey=${encodeURIComponent(siteKey)}`
    );
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
