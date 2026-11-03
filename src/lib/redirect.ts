import { NextResponse } from "next/server";

export const redirectTo = (location: string): NextResponse =>
  new NextResponse(null, { status: 307, headers: { Location: location } });
