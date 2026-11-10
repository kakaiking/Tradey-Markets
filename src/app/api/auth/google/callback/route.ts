import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkAndUpdateStreak, setSessionCookie } from "@/lib/auth";
import { AUTH_NEXT_COOKIE, safeNextPath } from "@/lib/authNext";
import {
    GOOGLE_OAUTH_STATE_COOKIE,
    exchangeGoogleCode,
    fetchGoogleProfile,
    toGoogleAuthUserMessage,
    upsertUserFromGoogle,
} from "@/lib/googleAuth";

function appUrl() {
    return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
}

export async function GET(req: Request) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const oauthError = url.searchParams.get("error");

    try {
        if (oauthError) {
            return NextResponse.redirect(
                `${appUrl()}/account/signin?error=${encodeURIComponent(oauthError)}`
            );
        }

        if (!code || !state) {
            return NextResponse.redirect(
                `${appUrl()}/account/signin?error=${encodeURIComponent("Missing OAuth code")}`
            );
        }

        const cookieStore = await cookies();
        const expectedState = cookieStore.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;
        cookieStore.delete(GOOGLE_OAUTH_STATE_COOKIE);

        if (!expectedState || expectedState !== state) {
            return NextResponse.redirect(
                `${appUrl()}/account/signin?error=${encodeURIComponent("Invalid OAuth state")}`
            );
        }

        const accessToken = await exchangeGoogleCode(code);
        const profile = await fetchGoogleProfile(accessToken);
        const user = await upsertUserFromGoogle(profile);

        await setSessionCookie(user.id);
        await checkAndUpdateStreak({
            id: user.id,
            currentStreak: user.currentStreak,
            lastActiveAt: user.lastActiveAt,
        });

        const next = safeNextPath(cookieStore.get(AUTH_NEXT_COOKIE)?.value);
        cookieStore.delete(AUTH_NEXT_COOKIE);

        return NextResponse.redirect(`${appUrl()}${next}`);
    } catch (error: unknown) {
        console.error("Google OAuth callback error:", error);
        return NextResponse.redirect(
            `${appUrl()}/account/signin?error=${encodeURIComponent(
                toGoogleAuthUserMessage(error)
            )}`
        );
    }
}
