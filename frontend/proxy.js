import { NextResponse } from "next/server";
import { isAuthenticated } from "./app/lib/auth";

const protectedURLs = ["/dashboard", "/logout"];

export async function proxy(request) {
    const isAuthenticate = await isAuthenticated();
    if (protectedURLs.includes(request.nextUrl.pathname)) {
        if (!isAuthenticate) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }
}
