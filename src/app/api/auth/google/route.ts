import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_NEXT_COOKIE, safeNextPath } from "@/lib/authNext";
import {
    GOOGLE_OAUTH_STATE_COOKIE,
    buildGoogleAuthUrl,
    createOAuthState,
    resolveAppOrigin,
    toGoogleAuthUserMessage,
} from "@/lib/googleAuth";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const next = safeNextPath(url.searchParams.get("next"));

        const state = createOAuthState();
        const cookieStore = await cookies();
        cookieStore.set(GOOGLE_OAUTH_STATE_COOKIE, state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 10, // 10 minutes
        });
        cookieStore.set(AUTH_NEXT_COOKIE, next, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 10, // 10 minutes
        });

        const authUrl = buildGoogleAuthUrl(state, req);
        return NextResponse.redirect(authUrl);
    } catch (error: unknown) {
        console.error("Google OAuth start error:", error);
        return NextResponse.redirect(
            `${resolveAppOrigin(req)}/account/signin?error=${encodeURIComponent(
                toGoogleAuthUserMessage(error)
            )}`
        );
    }
}
