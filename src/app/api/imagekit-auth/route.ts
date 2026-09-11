export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import { ADMIN_SESSION_COOKIE, isValidSessionToken } from "@/lib/server/adminSession";

export async function GET(req: NextRequest) {
  const adminKey = process.env.ADMIN_KEY;
  const session = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!adminKey || !isValidSessionToken(session, adminKey)) {
    return NextResponse.json(
      { error: "Unauthorized: admin session required" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    return NextResponse.json(
      { error: "Missing ImageKit environment variables" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }

  const imagekit = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });

  const auth = imagekit.getAuthenticationParameters();

  return NextResponse.json(auth, { headers: { "Cache-Control": "no-store" } });
}

