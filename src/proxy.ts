import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const destination = request.nextUrl.clone();
  destination.pathname = "/hotel-booking-enhanced";
  return NextResponse.rewrite(destination);
}

export const config = {
  matcher: ["/hotel-booking"],
};
