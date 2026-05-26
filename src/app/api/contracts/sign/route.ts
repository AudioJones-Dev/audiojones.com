export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const auth = req.headers.get("authorization") || "";
    if (!auth.startsWith("Bearer ")) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const idToken = auth.slice(7);

    const base = process.env.CONTRACTS_API_BASE || "https://us-central1-audiojoneswebsite.cloudfunctions.net";
    const url = `${base}/signContract`;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${idToken}` },
      body: JSON.stringify(body),
    });
    const data = await resp.json().catch(() => ({}));
    return NextResponse.json(data, { status: resp.status });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Server error" }, { status: 500 });
  }
}

