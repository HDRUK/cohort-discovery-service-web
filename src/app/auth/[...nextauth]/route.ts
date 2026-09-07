import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/nextAuthOptions";
import { isOidcEnabled } from "@/lib/oidc";

const handler = NextAuth(authOptions);

export async function GET(
  request: Request,
  context: { params: Promise<{ nextauth: string[] }> },
) {
  if (!isOidcEnabled()) {
    return NextResponse.json(
      { message: "OIDC authentication is disabled" },
      { status: 404 },
    );
  }

  return handler(request, context);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ nextauth: string[] }> },
) {
  if (!isOidcEnabled()) {
    return NextResponse.json(
      { message: "OIDC authentication is disabled" },
      { status: 404 },
    );
  }

  return handler(request, context);
}

