// Proxies widget lead submissions to the real backend (leadworks-api) so
// they actually land in Postgres, instead of returning a fake local success.
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    const res = NextResponse.json({ error: "invalid_json" }, { status: 400 });
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${API_URL}/api/ingest/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
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
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
