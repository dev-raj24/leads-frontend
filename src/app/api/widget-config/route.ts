import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const siteKey = searchParams.get('siteKey');

  if (!siteKey) {
    return NextResponse.json({ error: 'Missing siteKey' }, { status: 400 });
  }

  // Fake database response for the widget config based on the site key.
  // In a real app, this would query the Offer table where active = true and siteId matches.
  
  // You can change 'displayMode' to 'top', 'bottom-left', or 'none' to test.
  const mockConfig = {
    offer: {
      title: "Limited Time Offer!",
      body: "Get 20% off on invisible braces!",
      displayMode: "top", // Can be "top", "bottom-left", or "none"
      actionText: "Claim Offer",
      color: "#14161a"
    }
  };

  const res = NextResponse.json(mockConfig);
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
